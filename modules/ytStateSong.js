const Discord = require('discord.js')
const ytdl = require('ytdl-core-discord')


const state = {

  async reproduce(useProps) {
    const [messageProps, useMessageProps] = useProps
    let { voiceChannel, embed, conn, broadcast, songs, message: { channel } } = messageProps
    let song = null, broadcastDispatcher = null, dispatcher = null

    if (!voiceChannel || !conn || songs.get('queues').length == 0) return

    embed = new Discord.MessageEmbed

    if (songs.get("speaking")) {
      song = songs.get("queues")[songs.get('queues').length - 1]
      embed
        .setColor("#E62117")
        .setTitle(`**Foi adicionado na fila:** \n\n **\`\`${song.title}\`\`** `)
        .setDescription("")
        .setThumbnail(song.thumbnail)
        .addFields(
          { name: "**Duração**", value: song.duration.timestamp, inline: true },
          { name: "**Vídeo**", value: `[Acessar vídeo](${song.url})`, inline: true },
          { name: "**Canal**", value: `[${song.author.name}](${song.author.url})`, inline: true },
        )

      return channel.send(embed)
    } else 
      songs.set('current', song = songs.get('queues').shift())
    

    conn
      .on('error', _ => conn.disconnect())
      .on("disconnect", _ => state.disconnect(useProps))

    broadcastDispatcher = await broadcast
      .play(await ytdl(song.url, { filter: "audioonly" }), { volume: .8, type: "opus", highWaterMark: 80 })
      .on("finish", _ => state.finish(useProps))


    dispatcher = await conn
      .play(broadcast)
      .on("error", _ => conn.disconnect())
      .on("failed", _ => channel.send("<:error:773623679459262525> Não foi possível reproduzir o áudio."))
      .on("start", _ => state.sendMessage(useProps))


    songs.set("broadcastDispatcher", broadcastDispatcher)
    songs.set("dispatcher", dispatcher)
    useMessageProps(messageProps)
  },

  sendMessage([{ embed, songs, message: { channel } },]) {
    const { url, title, thumbnail, author, duration: { timestamp } } = songs.get('current')
    songs.set("speaking", true)

    embed
      .setColor("#E62117")
      .setTitle(`Tocando <a:song:771822822128353320> \n\n**\`\`${title}\`\`**`)
      .setDescription("")
      .setThumbnail(thumbnail)
      .addFields(
        { name: "**Duração**", value: timestamp, inline: true },
        { name: "**Vídeo**", value: `[Acessar vídeo](${url})`, inline: true },
        { name: "**Canal**", value: `[${author.name}](${author.url})`, inline: true },
      )

    channel.send(embed)
  },

  async finish(useProps) {
    const [messageProps, useMessageProps] = useProps
    const { voiceChannel, conn, songs } = messageProps

    if (!conn) return
    if (voiceChannel.members.size <= 1) return conn.disconnect()

    songs.set("speaking", false)
    songs.set("played", songs.get("current"))
    songs.set("current", null)

    useMessageProps(messageProps)

    if ([null, 0].includes(songs.get("queues")?.length)) return
    
    state.reproduce(useProps)
  },

  disconnect([messageProps, useMessageProps]) {
    const { songs } = messageProps

    songs.set("speaking", false)
    songs.set('queues', [])
    songs.set('current', null)
    songs.set('played', [])

    useMessageProps(messageProps)
  }
}

module.exports = state