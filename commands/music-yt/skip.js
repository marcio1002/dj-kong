const implements = require('../../modules/func_implements')
const { finish } = require("../../modules/ytStateSong")

module.exports = {
  name: "ytsk",
  description: "Pula a reprodução e começa a próxima na lista se houver.",
  execute(useProps) {
    const [{ voiceChannel, embed, conn, songs },] = useProps
    if (!voiceChannel || !conn) return

    embed
      .setColor(implements.colorRadomEx())
      .setDescription("<:skip:633071783351812096> **Skipped**");

    songs.get("broadcastDispatcher").destroy()


    finish(useProps)
  }
}