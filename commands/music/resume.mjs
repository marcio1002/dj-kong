import helpers from '../../modules/helpers.mjs'

const command = {
  name: 'rs',
  description: 'Retorna a música pausada.',
  exemple: `\n**Como usar:**\n\`\`\`${PREFIX}rs\`\`\``,
  execute([{ voiceChannel, embed, streaming, songs, message: { channel } },]) {
    const songsProps = streaming.get(voiceChannel?.id)

    if (!voiceChannel || !songsProps?.connection) return

    if (songsProps.broadcastDispatcher.paused) {
      
      songsProps.broadcastDispatcher.resume()

      embed
        .setColor(helpers.colorRadomEx())
        .setDescription('<:play:633088252940648480> **Resuming**')

      channel.send(embed)
    }
  }
}

export default command