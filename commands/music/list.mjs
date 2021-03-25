const command = {
  name: 'ls',
  description: 'Lista as músicas na fila de espera.',
  execute([{ voiceChannel, embed, streaming , message: { channel } },]) {
    let songQueues = [], songsProps = streaming.get(voiceChannel?.id)
    if(!voiceChannel || songsProps?.connection) return

    songsProps
    .queues
    .forEach(song => songQueues.push(`<:pastaMusic:630461639208075264> [**\`\`${song.title}\`\`**](${song.url}) \n`))

    embed
      .setTitle('Lista de músicas na fila')
      .setDescription(songQueues.length ? songQueues : '**``Lista vazia``**')

    channel.send(embed)
  }
}

export default command