import helpers from '../../modules/helpers.mjs'

const command  = {
  name: "ytps",
  description: "Pausa a reprodução.",
  execute([{ voiceChannel, conn, embed, songs, message: { channel, author } },]) {

    if (!voiceChannel || !conn) return

    if (songs.get("speaking")) {
      embed
        .setDescription("<:pause:633071783465058334> **Paused**")
        .setColor(helpers.colorRadomEx())

      songs.get("broadcastDispatcher").pause(true)
      
      channel.send(embed)
    }
  }

}

export default command