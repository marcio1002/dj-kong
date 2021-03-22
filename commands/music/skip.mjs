import helpers from '../../modules/helpers.mjs'
import { finish } from "../../modules/stateSong.mjs"

const command = {
  name: "sk",
  description: "Pula a música e começa a próxima na lista se houver.",
  execute(useProps) {
    const [{ voiceChannel, embed, conn, songs },] = useProps
    if (!voiceChannel || !conn) return

    embed
      .setColor(helpers.colorRadomEx())
      .setDescription("<:skip:633071783351812096> **Skipped**");

    songs.get("broadcastDispatcher").destroy()


    finish(useProps)
  }
}

export default command