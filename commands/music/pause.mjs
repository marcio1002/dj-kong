import helpers from '../../modules/helpers.mjs'

const command  = {
  name: 'ps',
  description: 'Pausa a música.',
  execute([{ voiceChannel, conn, embed, songs, message: { channel, author } },]) {

    if (!voiceChannel || !conn || !songs.get('broadcastDispatcher') || !songs.get('dispatcher')) return

    if (songs.get('speaking') && !songs.get('broadcastDispatcher').paused) {
      embed
        .setDescription('<:pause:633071783465058334> **Paused**')
        .setColor(helpers.colorRadomEx())

        songs.get('broadcastDispatcher').pause(true)
      
      channel.send(embed)
    }
  }

}

export default command