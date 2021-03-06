const implements = require('../../modules/func_implements')

module.exports = {
  name: "ytrm",
  description: "Retorna a reprodução pausada.",
  execute([{ voiceChannel, embed, conn, songs, message: { channel } },]) {

    if (!voiceChannel || !conn) return

    if (songs.get("dispatcher").paused) {
      songs.get("dispatcher").resume()

      embed
        .setColor(implements.colorRadomEx())
        .setDescription("<:play:633088252940648480> **Resuming**")

      channel.send(embed)
    }
  }
}