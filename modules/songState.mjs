import Discord from 'discord.js'
import ytdl from 'ytdl-core-discord'
import spdl from 'discord-spdl-core'
import helpers from '../modules/helpers.mjs'
import { embedYoutubePlay, embedYoutubeQueue, embedSpotifyPlay, embedSpotifyQueue } from './messageEmbed.mjs'

async function reproduceYoutube(song, useProps) {
  const voiceChannel = useProps[0].voiceChannel, songsProps = useProps[0].streaming.get(voiceChannel?.id)

  return ytdl(song.url, { filter: 'audioonly' })
    .then(stream => {
      return songsProps.broadcast
        .play(stream, { volume: .8, type: 'opus', highWaterMark: 80 })
        .once('finish', _ => finish(useProps, voiceChannel))
    })
    .catch(console.log)
}

async function reproduceSpotify(song, useProps) {
  const voiceChannel = useProps[0].voiceChannel, songsProps = useProps[0].streaming.get(voiceChannel?.id)

  return spdl(song.url, { filter: 'audioonly', opusEncoded: true })
    .then(stream => {
      return songsProps.broadcast
        .play(stream, { volume: .8, type: 'opus', highWaterMark: 80 })
        .once('finish', _ => finish(useProps, voiceChannel))
    })
    .catch(console.log)
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
  let { voiceChannel, streaming, message: { channel } } = messageProps, songsProps = streaming.get(voiceChannel?.id), dispatcher

  dispatcher = await songsProps.connection
    .play(songsProps.broadcast)
    .once('start', _ => sendMessage(useProps, voiceChannel))
    .once('error', _ => songsProps.connection.disconnect())
    .once('failed', _ => {
      channel.send(
        (new Discord)
          .setColor(helpers.colorRadomEx())
          .setDescription(`<:error:773623679459262525> Não foi possível reproduzir a música.\nA causa do erro pode ser pelo tempo da espera da conexão ou porque a música sugerida é privada.`)
      )
    })

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
    if(!voiceChannel || !songsProps.connection) return

    if(voiceChannel?.members?.size == 1 && voiceChannel.members.get(bot.user.id) )
      songsProps.connection.disconnect()
  }, 90000)

  if ([null, 0].includes(songsProps.queues.length)) return

  reproduce(useProps)
}

function disconnect([{ streaming, voiceChannel },]) {
  streaming.delete(voiceChannel?.id)
}

async function reproduce(useProps) {
  const [messageProps,] = useProps
  let { voiceChannel, streaming, message: { channel } } = messageProps, songsProps = streaming.get(voiceChannel?.id), song = null

  if (!voiceChannel || !songsProps?.connection || songsProps?.queues?.length == 0) return

  if (songsProps.speaking) {
    song = songsProps.queues[songsProps.queues.length - 1]
    return songsProps.channel.send(helpers.isSpotifyURL(song.url) ? embedSpotifyQueue(song) : embedYoutubeQueue(song))
  } else
    songsProps.current = songsProps.queues.shift()


  songsProps.connection
    .once('error', _ => songsProps.connection.disconnect())
    .once('disconnect', _ => disconnect(useProps))

  helpers.isSpotifyURL(songsProps.current.url) ? 
    reproduceSpotify(songsProps.current, useProps).then(broadcastDispatcher => play(useProps, broadcastDispatcher)) : 
    reproduceYoutube(songsProps.current, useProps).then(broadcastDispatcher => play(useProps, broadcastDispatcher))  
}


export { reproduce, play, sendMessage, finish, disconnect, reproduceSpotify, reproduceYoutube, embedSpotifyPlay, embedSpotifyQueue, embedYoutubePlay, embedYoutubeQueue }