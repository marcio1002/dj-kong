const implements = require('../../modules/func_implements')

module.exports = {
  name: "ytps",
  description: "Pausa a reprodução.",
  execute([{ voiceChannel, conn, embed, songs, message: { channel, author } },]) {

    if (!voiceChannel || !conn) return

    if (songs.get("speaking")) {
      embed
        .setDescription("<:pause:633071783465058334> **Paused**")
        .setColor(implements.colorRadomEx())

      songs.get("broadcastDispatcher").pause(true)
      
      channel.send(embed)
    } else {
      return channel.send(`<@${author.id}>  <:huuum:648550001298898944> nenhuma música tocando nesse canal!`)
    }
  }

}