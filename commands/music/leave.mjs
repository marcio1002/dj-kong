const command = {
  name: 'lv',
  description: 'Saí do canal de voz.',
  async execute([messageProps,]) {
    const { voiceChannel, streaming, broadcast, message } = messageProps
    const songsProps = streaming.get(voiceChannel?.id)

    if (!voiceChannel || !songsProps?.connection || !broadcast) return

    songsProps.broadcastDispatcher.destroy()
    await songsProps.connection.disconnect()
    
    message.react('😢').then( v => (v.remove(),message.react('👋🏾')))    
  }
}


export default command