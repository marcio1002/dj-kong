const command = {
  name: 'ls',
  description: 'Lista as músicas na fila de espera.',
  exemple: `\n**Como usar:**\n\`\`\`${PREFIX}ls\`\`\``,
  async execute([{ voiceChannel, embed, streaming , message: { channel } },]) {
    let songQueues = [], index = 1, songsProps = streaming.get(voiceChannel?.id)
    if(!voiceChannel || !songsProps?.connection) return

    songsProps
    .queues
    .forEach(song => songQueues.push(`**${index++} ➜** <:pastaMusic:630461639208075264> [**\`\`${song.title}\`\`**](${song.url}) \n`))

    embed
      .setTitle('Lista de músicas na fila de espera.')
      .setDescription(songQueues.length ? songQueues : '**``Lista vazia``**');

   (await channel.send(embed)).delete({ timeout: 55000 })
  }
}

export default command