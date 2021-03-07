const { finish } = require("../../modules/ytStateSong")

module.exports = {
  name: "ytsp",
  description: "Finaliza a reprodução.",
  execute(useProps) {
    const [{voiceChannel, embed, songs, conn, broadcast, message: { channel } },] = useProps
    
    if (!voiceChannel || !conn || !broadcast) return

    if (songs.get("speaking")) {
      embed
        .setDescription("<:stop:648561120155795466> **Stopped**")

      songs.get("dispatcher").destroy()

      channel.send(embed)

      finish(useProps)
    }
  }
}