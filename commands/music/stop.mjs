import { finish } from '../../modules/songState.mjs'

const command = {
  name: 'sp',
  description: 'Finaliza a música.',
  execute(useProps) {
    const [{voiceChannel, embed, streaming, broadcast, message: { channel } },] = useProps
    const songsProps = streaming.get(voiceChannel?.id)

    if (!voiceChannel || !songsProps?.connection || !broadcast) return

    if (songsProps.speaking) {
      embed
        .setDescription('<:stop:648561120155795466> **Stopped**')

      songsProps.speaking = false
      songsProps.broadcastDispatcher.destroy()

      channel.send(embed)

      finish(useProps)
    }
  }
}

export default command