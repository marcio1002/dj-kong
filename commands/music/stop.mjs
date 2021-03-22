import { finish } from "../../modules/stateSong.mjs"

const command = {
  name: "sp",
  description: "Finaliza a música.",
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

export default command