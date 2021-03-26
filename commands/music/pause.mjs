import helpers from '../../modules/helpers.mjs'

const command  = {
  name: 'ps',
  description: 'Pausa a música.',
  execute([{ voiceChannel, embed, streaming , message: { channel } },]) {
    const songsProps = streaming.get(voiceChannel?.id)

    if (!voiceChannel || !songsProps.connection || !songsProps.broadcastDispatcher || !songsProps.dispatcher) return

    if (songsProps.speaking && !songsProps.broadcastDispatcher.paused) {
      embed
        .setDescription('<:pause:633071783465058334> **Paused**')
        .setColor(helpers.colorRadomEx())

        songsProps.broadcastDispatcher.pause(true)
      
      channel.send(embed)
    }
  }

}

export default command