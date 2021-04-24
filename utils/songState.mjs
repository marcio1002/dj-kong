import Discord from 'discord.js'
import ytdl from 'ytdl-core-discord'
import spdl from 'discord-spdl-core'
import helpers from '../utils/helpers.mjs'
import { embedYoutubePlay, embedAddQueue, embedSpotifyPlay, embedPlaylistQueue } from './messageEmbed.mjs'

let eventFinish = null

async function reproduceYoutube(song, useProps) {
  const { voiceChannel, streaming } = useProps[0], songsProps = streaming.get(voiceChannel?.id)

  eventFinish = _ => finish(useProps, voiceChannel)

  return ytdl(song.url, { filter: 'audioonly' })
    .then(stream => {
      return songsProps.broadcast
        .play(stream, { volume: 1, type: 'opus', highWaterMark: 80 })
        .once('finish', eventFinish)
    })
    .catch(console.error)
}

async function reproduceSpotify(song, useProps) {
  const { voiceChannel, streaming } = useProps[0], songsProps = streaming.get(voiceChannel?.id)

  eventFinish = _ => finish(useProps, voiceChannel)

  return spdl(song.url, { filter: 'audioonly', opusEncoded: true })
    .then(stream => {
      return songsProps.broadcast
        .play(stream, { volume: 1, type: 'opus', highWaterMark: 80 })
        .once('finish', eventFinish)
    })
    .catch(console.error)
}

function sendMessage([{ streaming },], voiceChannel) {
  let songsProps = streaming.get(voiceChannel?.id)
  songsProps.speaking = true

  songsProps.channel.send(
    helpers.isSpotifyURL(songsProps.current.url) ?
      embedSpotifyPlay(songsProps.current) :
      embedYoutubePlay(songsProps.current)
  )
}

async function play(useProps, broadcastDispatcher) {
  const [messageProps, setMessageProps] = useProps
  let dispatcher, eventStart, eventError, eventFailed, { voiceChannel, streaming, message: { channel } } = messageProps, songsProps = streaming.get(voiceChannel?.id)

  eventStart = _ => sendMessage(useProps, voiceChannel)
  eventError = _ => songsProps.connection.disconnect()
  eventFailed = _ => channel.send(
    (new Discord)
      .setColor(helpers.colorRadomEx())
      .setDescription(`<:error:773623679459262525> Não foi possível reproduzir a música.\nA causa do erro pode ser pelo tempo da espera da conexão ou porque a música sugerida é privada.`)
  )


  if (songsProps?.broadcastDispatcher && songsProps?.dispatcher) {
    songsProps.broadcastDispatcher.removeAllListeners('finish')
    songsProps.dispatcher
      .removeAllListeners('start')
      .removeAllListeners('error')
      .removeAllListeners('failed')
  }

  dispatcher = await songsProps.connection
    .play(songsProps.broadcast)
    .once('start', eventStart)
    .once('error', eventError)
    .once('failed', eventFailed)

  songsProps.broadcastDispatcher = broadcastDispatcher
  songsProps.dispatcher = dispatcher
  setMessageProps(messageProps)
}

async function finish(useProps, voiceChannel) {
  const [messageProps, setMessageProps] = useProps, { streaming, bot } = messageProps
  let songsProps = streaming.get(voiceChannel?.id)

  if (!voiceChannel || !songsProps?.connection) return

  messageProps.voiceChannel = voiceChannel
  songsProps.speaking = false
  songsProps.played = songsProps.current
  songsProps.current = null

  setMessageProps(messageProps)

  setTimeout(() => {
    if (!voiceChannel || !songsProps.connection) return

    if (voiceChannel?.members?.size == 1 && voiceChannel.members.get(bot.user.id))
      songsProps.connection.disconnect()
  }, 100000)

  if ([null, 0].includes(songsProps.queues.length)) return

  reproduce(useProps)
}

function disconnect([{ streaming, voiceChannel },]) {
  streaming.delete(voiceChannel?.id)
}

async function reproduce(useProps) {
  const [messageProps,] = useProps
  let song = null, color, typeMsg, typeMsgEmbed, eventError, eventDisconnect, { voiceChannel, streaming, message: { channel } } = messageProps, songsProps = streaming.get(voiceChannel?.id)

  if (!voiceChannel || !songsProps?.connection || songsProps?.queues?.length == 0) return

  eventError = _ => songsProps.connection.disconnect()
  eventDisconnect = _ => disconnect(useProps)

  if (songsProps.speaking) {
    song = songsProps.queues[songsProps.queues.length - 1]
    color = helpers.isSpotifyURL(song.url) ? '#1DB954' : '#E62117'
    typeMsg = helpers.isSpotifyURL(song.url) ? 1 : 0
    typeMsgEmbed = songsProps.playlist ? embedPlaylistQueue(songsProps.playlist, typeMsg, color) : embedAddQueue(song, color)
    
    return songsProps.channel.send(typeMsgEmbed)
  } else
    songsProps.current = songsProps.queues.shift()

  songsProps.connection
    .removeAllListeners('error')
    .removeAllListeners('disconnect')

  songsProps.connection
    .once('error', eventError)
    .once('disconnect',eventDisconnect)

  helpers.isSpotifyURL(songsProps.current.url) ?
    reproduceSpotify(songsProps.current, useProps).then(broadcastDispatcher => play(useProps, broadcastDispatcher)) :
    reproduceYoutube(songsProps.current, useProps).then(broadcastDispatcher => play(useProps, broadcastDispatcher))
}


export { reproduce, play, sendMessage, finish, disconnect, reproduceSpotify, reproduceYoutube, embedSpotifyPlay, embedYoutubePlay, embedAddQueue }