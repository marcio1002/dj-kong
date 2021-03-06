const ytdl = require('ytdl-core')

const state = {
  async reproduce(useProps) {
    const [ messageProps, useMessageProps ] = useProps
    const {voiceChannel, embed, conn, songs, message: { channel } } = messageProps
    let song = null,dispatcher = null

    if (!voiceChannel || !conn || songs.get('queues').length == 0) return

    
    if (songs.get("speaking")) {
      song = songs.get("queues")[0]
      embed
        .setColor("#E62117")
        .setTitle(`**Foi adicionado na fila:** \n\n **\`\`${song.title}\`\`** `)
        .setDescription("")
        .setThumbnail(song.thumbnail)
        .addFields(
          {name: "**Duração**", value: song.duration.timestamp, inline: true},
          {name: "**Vídeo**", value: `[Acessar vídeo](${song.url})`, inline: true},
          {name: "**Canal**", value: `[${song.author.name}](${song.author.url})`, inline: true},
        )

      return channel.send(embed)
    } else {
      song = songs.get('queues').shift()
      songs.set('current', song)
    }

    conn
      .on('error', _=> conn.disconnect())
      .on("disconnect", _=> state.disconnect(useProps))

    dispatcher = await conn.play(ytdl(song.url), { volume: 0.5 })
      .on("error", _=> conn.disconnect())
      .on("start", _=> state.sendMessage(useProps))
      .on("finish", _=> state.finish(useProps))

      songs.set("dispatcher", dispatcher)
      useMessageProps(messageProps)
  },

  sendMessage([{ embed,songs, message: { channel } },]) {
    const { url, title, thumbnail, author, duration: { timestamp } } = songs.get('current')
    songs.set("speaking", true)
    
    embed
      .setColor("#E62117")
      .setTitle(`Tocando <a:song:771822822128353320> \n\n**\`\`${title}\`\`**`)
      .setDescription("")
      .setThumbnail(thumbnail)
      .addFields(
        {name: "**Duração**", value: timestamp, inline: true},
        {name: "**Vídeo**", value: `[Acessar vídeo](${url})`, inline: true},
        {name: "**Canal**", value: `[${author.name}](${author.url})`, inline: true},
      )

    channel.send(embed)
  },

  finish(useProps) {
    const [ messageProps, useMessageProps ] = useProps
    const { voiceChannel, conn, songs } = messageProps

    if(!conn) return
    if (voiceChannel.members.size <= 1) return conn.disconnect()

    songs.set("speaking", false)
    songs.set("played", [songs.get("current"), ...songs.get("played")])
    songs.set("current",null)

    useMessageProps(messageProps)
    
    if ([null, []].includes(songs.get("queues"))) return

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