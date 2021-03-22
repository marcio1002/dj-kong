import helpers from '../../modules/helpers.mjs'

const command = {
  name: "rs",
  description: "Retorna a música pausada.",
  execute([{ voiceChannel, embed, conn, songs, message: { channel } },]) {

    if (!voiceChannel || !conn) return

    if (songs.get("broadcastDispatcher").paused) {
      
      songs.get("broadcastDispatcher").resume()

      embed
        .setColor(helpers.colorRadomEx())
        .setDescription("<:play:633088252940648480> **Resuming**")

      channel.send(embed)
    }
  }
}

export default command