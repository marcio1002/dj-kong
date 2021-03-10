import Discord from 'discord.js'
import ytdl from 'ytdl-core-discord'

  function sendEmbedMessage(songInfo) {
    return (new Discord.MessageEmbed())
      .setColor("#E62117")
      .setTitle(`Tocando <a:song:771822822128353320> \n\n**\`\`${songInfo.title}\`\`**`)
      .setThumbnail(songInfo.thumbnail)
  }

  function sendEmbedQueue(songInfo) {
    return (new Discord.MessageEmbed())
      .setColor("#E62117")
      .setTitle(`**Adicionado na fila:** \n\n **\`\`${songInfo.title}\`\`** `)
      .addFields(
        { name: "**Duração**", value: songInfo.duration.timestamp, inline: true },
        { name: "**Vídeo**", value: `[Acessar vídeo](${songInfo.url})`, inline: true },
        { name: "**Canal**", value: `[${songInfo.author.name}](${songInfo.author.url})`, inline: true },
      )
  }

  async function reproduce(useProps) {
    const [messageProps, useMessageProps] = useProps
    let { voiceChannel, conn, broadcast, songs, message: { channel } } = messageProps
    let song = null, broadcastDispatcher = null, dispatcher = null

    if (!voiceChannel || !conn || songs.get('queues').length == 0) return

    if (songs.get("speaking")) {
      song = songs.get("queues")[songs.get('queues').length - 1]
      return channel.send(sendEmbedQueue(song))
    } else
      songs.set('current', song = songs.get('queues').shift())


    conn
      .on('error', _ => conn.disconnect())
      .on("disconnect", _ => disconnect(useProps))

    broadcastDispatcher = await broadcast
      .play(await ytdl(song.url, { filter: "audioonly" }), { volume: .8, type: "opus", highWaterMark: 70 })
      .on("finish", _ => finish(useProps))


    dispatcher = await conn
      .play(broadcast)
      .on("error", _ => conn.disconnect())
      .on("failed", _ => channel.send("<:error:773623679459262525> Não foi possível reproduzir o áudio."))
      .on("start", _ => sendMessage(useProps))


    songs.set("broadcastDispatcher", broadcastDispatcher)
    songs.set("dispatcher", dispatcher)
    useMessageProps(messageProps)
  }

  function sendMessage([{ songs, message: { channel } },]) {
    songs.set("speaking", true)
    channel.send(sendEmbedMessage(songs.get('current')))
  }

  async function finish(useProps) {
    const [messageProps, useMessageProps] = useProps
    const { voiceChannel, conn, songs } = messageProps

    if (!conn) return
    if (voiceChannel.members.size <= 1) return conn.disconnect()

    songs.set("speaking", false)
    songs.set("played", songs.get("current"))
    songs.set("current", null)

    useMessageProps(messageProps)

    if ([null, 0].includes(songs.get("queues")?.length)) return

    reproduce(useProps)
  }

  function disconnect([messageProps, useMessageProps]) {
    const { songs } = messageProps

    songs.set("speaking", false)
    songs.set('queues', [])
    songs.set('current', null)
    songs.set('played', [])

    useMessageProps(messageProps)
  }


export { reproduce, sendMessage, finish, disconnect }