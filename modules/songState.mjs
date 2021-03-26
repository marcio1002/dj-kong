import Discord from 'discord.js'
import ytdl from 'ytdl-core-discord'
import spdl from 'discord-spdl-core'
import helpers from '../modules/helpers.mjs'
import { embedYoutubePlay, embedYoutubeQueue, embedSpotifyPlay, embedSpotifyQueue } from './messageEmbed.mjs'

  async function reproduce(useProps) {
    const [messageProps, setMessageProps] = useProps
    let { voiceChannel, broadcast, streaming, message: { channel } } = messageProps
    let songsProps = streaming.get(voiceChannel?.id), song = null, broadcastDispatcher = null, dispatcher = null

    if (!voiceChannel || !songsProps?.connection || songsProps?.queues?.length == 0) return

    if (songsProps.speaking) {
      song = songsProps.queues[songsProps.queues.length - 1]
      return channel.send(helpers.isSpotify(song) ? embedSpotifyQueue(song) : embedYoutubeQueue(song))
    } else
      songsProps.current = songsProps.queues.shift()


    songsProps.connection
      .on('error', _ => songsProps.connection.disconnect())
      .on('disconnect', _ => disconnect(useProps))

    broadcastDispatcher = helpers.isSpotify(songsProps.current) ? await reproduceSpotify(songsProps.current, useProps) :  await reproduceYoutube(songsProps.current, useProps)

    dispatcher = await songsProps.connection
      .play(broadcast)
      .once('start', _ => sendMessage(useProps))
      .on('error', _ => songsProps.connection.disconnect())
      .on('failed', _ => {
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

  async function reproduceYoutube(song, useProps) {
    let voiceChannel = useProps[0].voiceChannel

    return await useProps[0].broadcast
      .play(await ytdl(song.url, { filter: 'audioonly' }), { volume: .9, type: 'opus', highWaterMark: 70 })
      .on('finish', _ => finish(useProps, voiceChannel))
  }

  async function reproduceSpotify(song, useProps) {
    let voiceChannel = useProps[0].voiceChannel

    return await useProps[0].broadcast
      .play(await spdl(song.url, { filter: 'audioonly', opusEncoded: true }), { volume: .9, type: 'opus', highWaterMark: 70 })
      .on('finish', _ => finish(useProps, voiceChannel))
  }

  function sendMessage([{ voiceChannel, streaming, message: { channel } },]) {
    let songsProps = streaming.get(voiceChannel?.id)
    songsProps.speaking = true

    channel.send( 
        helpers.isSpotify(songsProps.current) ? 
          embedSpotifyPlay(songsProps.current) : 
          embedYoutubePlay(songsProps.current)
    )
  }

  async function finish(useProps, voiceChannel) {
    const [messageProps, setMessageProps] = useProps
    const { streaming } = messageProps
    let songsProps = streaming.get(voiceChannel?.id)

    if (!voiceChannel || !songsProps?.connection) return

    messageProps.voiceChannel = voiceChannel
    songsProps.speaking = false
    songsProps.played = songsProps.current
    songsProps.current = null

    setMessageProps(messageProps)

    if ([null, 0].includes(songsProps.queues.length)) return

    reproduce(useProps)
  }

  function disconnect([{ streaming, voiceChannel },]) {
    streaming.delete(voiceChannel?.id)
  }


export { reproduce, sendMessage, finish, disconnect, reproduceSpotify, reproduceYoutube, embedSpotifyPlay, embedSpotifyQueue, embedYoutubePlay, embedYoutubeQueue }