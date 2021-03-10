import ytdl from 'ytdl-core-discord'
import { sendMessage , finish, disconnect } from '../../modules/ytStateSong.mjs'

const command = {
  name: "ytr",
  description: "Retorna a reprodução de audio que estava tocando anteriormente.",
  async execute(useProps) {
    const [ messageProps, useMessageProps] = useProps
    const { voiceChannel, conn, songs, broadcast, message: { channel } } = messageProps
    let current,broadcastDispatcher,dispatcher

    if (!voiceChannel || !conn || !broadcast || songs.get("played") == null) return

    current = songs.get("current")
    songs.set("current", songs.get("played"))
    songs.get("played", current)
    const { url } = songs.get("current")
    
    conn
    .on('error',  _=> conn.disconnect() )
    .on("disconnect", _=> disconnect(useProps))

    broadcastDispatcher = await broadcast
      .play(await ytdl(url, { filter: "audioonly" }), { volume: .8, type: "opus", highWaterMark: 80 })
      .on("finish", _ => finish(useProps))

    dispatcher = await conn
      .play(broadcast)
      .on("error", err => conn.disconnect())
      .on("failed", _ => channel.send("<:error:773623679459262525> Não foi possível reproduzir o áudio."))
      .on("start", _=> sendMessage(useProps))

      songs.set("broadcastDispatcher", broadcastDispatcher)
      songs.set("dispatcher", dispatcher)
      useMessageProps(messageProps)
  },
}

export default command