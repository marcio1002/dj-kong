module.exports = {
  name: "ytl",
  description: "Finaliza a reprodução de audio e saí do canal de voz.",
  execute([messageProps,]) {
    const { voiceChannel, conn } = messageProps

    if (!voiceChannel || !conn) return

    conn.disconnect()

  }
}