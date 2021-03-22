import Discord from 'discord.js'
import ytdl from 'ytdl-core-discord'
import spdl from 'discord-spdl-core'
import helpers from '../modules/helpers.mjs'
import { embedYoutubePlay, embedYoutubeQueue, embedSpotifyPlay, embedSpotifyQueue } from './messageEmbed.mjs'
  

  async function reproduce(useProps) {
    const [messageProps, setMessageProps] = useProps
    let { voiceChannel, conn, broadcast, songs, message: { channel } } = messageProps
    let song = null, broadcastDispatcher = null, dispatcher = null

    if (!voiceChannel || !conn || songs.get('queues').length == 0) return

    if (songs.get("speaking")) {
      song = songs.get("queues")[songs.get('queues').length - 1]
      return channel.send(helpers.isSpotify(song) ? embedSpotifyQueue(song) : embedYoutubeQueue(song))
    } else
      songs.set('current', song = songs.get('queues').shift())


    conn
      .on('error', _ => conn.disconnect())
      .on("disconnect", _ => disconnect(useProps))

    broadcastDispatcher = helpers.isSpotify(song) ? await reproduceSpotify(song, useProps) :  await reproduceYoutube(song, useProps)

    dispatcher = await conn
      .play(broadcast)
      .on("start", _ => sendMessage(useProps))
      .on("error", _ => conn.disconnect())
      .on("failed", _ => {
        channel.send(
          (new Discord)
            .setColor(helpers.colorRadomEx())
            .setDescription(`<:error:773623679459262525> Não foi possível reproduzir a música.\nA causa do erro pode ser pelo tempo da espera da conexão ou porque o vídeo sugerido é privado.`)
        )
      })

    songs.set("broadcastDispatcher", broadcastDispatcher)
    songs.set("dispatcher", dispatcher)
    setMessageProps(messageProps)
  }

  async function reproduceYoutube(song, useProps) {
    return await useProps[0].broadcast
      .play(await ytdl(song.url, { filter: "audioonly" }), { volume: .8, type: "opus", highWaterMark: 70 })
      .on("finish", _ => finish(useProps))
  }

  async function reproduceSpotify(song, useProps) {
    return await useProps[0].broadcast
      .play(await spdl(song.url, { filter: "audioonly", opusEncoded: true }), { volume: .8, type: "opus", highWaterMark: 70 })
      .on("finish", _ => finish(useProps))
  }

  function sendMessage([{ songs, message: { channel } },]) {
    songs.set("speaking", true)
    channel.send( 
        helpers.isSpotify(songs.get('current')) ? 
          embedSpotifyPlay(songs.get('current')) : 
          embedYoutubePlay(songs.get('current'))
    )
  }

  async function finish(useProps) {
    const [messageProps, setMessageProps] = useProps
    const { voiceChannel, conn, songs } = messageProps

    if (!conn) return
    if (voiceChannel.members.size <= 1) return conn.disconnect()

    songs.set("speaking", false)
    songs.set("played", songs.get("current"))
    songs.set("current", null)

    setMessageProps(messageProps)

    if ([null, 0].includes(songs.get("queues")?.length)) return

    reproduce(useProps)
  }

  function disconnect([messageProps, setMessageProps]) {
    const { songs } = messageProps

    songs.set("speaking", false)
    songs.set('queues', [])
    songs.set('current', null)
    songs.set('played', [])

    setMessageProps(messageProps)
  }


export { reproduce, sendMessage, finish, disconnect, reproduceSpotify, reproduceYoutube, embedSpotifyPlay, embedSpotifyQueue, embedYoutubePlay, embedYoutubeQueue }