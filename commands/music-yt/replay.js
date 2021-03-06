const ytdl = require('ytdl-core')
const { sendMessage , finish, disconnect} = require('../../modules/ytStateSong')

module.exports = {
  name: "ytr",
  description: "Retorna a reprodução de audio que estava tocando anteriormente.",
  async execute(useProps) {
    const [ messageProps, useMessageProps] = useProps
    const { voiceChannel, conn, songs } = messageProps

    if (!voiceChannel || !conn || songs.get("played").length == 0) return

    songs.set("current", songs.get("played").shift())
    const { url } = songs.get("current")

    useMessageProps(messageProps)

    conn
      .on('error',  _=> conn.disconnect() )
      .on("disconnect", _=> disconnect(useProps))

    dispatcher = await conn.play(ytdl(url), { volume: 0.5 })
      .on("error", err => conn.disconnect())
      .on("start", _=> sendMessage(useProps))
      .on("finish", _=> finish(useProps))
  },
}