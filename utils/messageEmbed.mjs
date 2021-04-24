import Discord from 'discord.js'

function embedYoutubePlay({ title, thumbnail, url, timestamp, channel }) {
  return (new Discord.MessageEmbed())
    .setColor('#E62117')
    .setTitle(`Tocando <a:listening_music:833001205767733289>\n\n**\`\`${title}\`\`**`)
    .setThumbnail(thumbnail)
    .addFields(
      { name: '**Duração**', value: timestamp, inline: true },
      { name: '**Vídeo**', value: `[Ouvir no youtube](${url})`, inline: true },
      { name: '**Canal**', value: `[${channel.title}](${channel.url})`, inline: true },
    )
}

function embedAddQueue({ thumbnail, title, album }, color) {
  return (new Discord.MessageEmbed())
    .setColor(color)
    .setThumbnail(thumbnail ?? album?.thumbnail)
    .setTitle(`**Adicionado na fila:** \n\n **\`\`${title}\`\`** `)
}

function embedSpotifyPlay({ title, timestamp, url, album }) {
  let artists = album.artists.map(s => `[${s.name}](${s.external_urls.spotify})`)

  return (new Discord.MessageEmbed())
    .setColor('#1DB954')
    .setTitle(`Tocando <a:listening_music:833001205767733289>\n\n**\`\`${title}\`\`**`)
    .setThumbnail(album.thumbnail)
    .addFields(
      { name: '**Duração**', value: timestamp, inline: true },
      { name: '**Música**', value: `[Ouvir no spotify](${url})`, inline: true },
      { name: '**Album**', value: `[${album.name}](${album.external_urls.spotify})`, inline: true },
      { name: '**Artistas**', value: artists.join('\n') ?? 'Desconhecido', inline: true }
    )
}


function embedPlaylistQueue({ title, thumbnail }, type, color) {
  return (new Discord.MessageEmbed())
    .setColor(color)
    .setThumbnail(thumbnail)
    .setTitle(`**${type == 1 ? 'Album adicionado' : 'Playlist adicionada'}:** \n\n **\`\`${title}\`\`** `)
}

function embedPlaylist({ title, thumbnail, description, color }) {
  return (new Discord.MessageEmbed())
    .setColor(color)
    .setThumbnail(thumbnail)
    .setTitle(title)
    .setDescription(description)
}

function embedListOptions(title, color, options) {
  return (new Discord.MessageEmbed())
    .setColor(color)
    .setTitle(title)
    .setDescription(options);
}

export {
  embedPlaylistQueue,
  embedYoutubePlay,
  embedAddQueue,
  embedSpotifyPlay,
  embedListOptions,
  embedPlaylist,
}