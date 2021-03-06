module.exports = {
  name: "ytls",
  description: "Lista todos os audios que estão na lista de espera.",
  execute([{ embed, songs, message: { channel } },]) {
    let songQueues = []

    songs
    .get("queues")
    .forEach(song => songQueues.push(`<:pastaMusic:630461639208075264> [**\`\`${song.title}\`\`**](${song.url}) \n`))

    embed
      .setTitle("Lista de músicas na fila")
      .setDescription(songQueues.length ? songQueues : "**``Lista vazia``**")

    channel.send(embed)
  }
}