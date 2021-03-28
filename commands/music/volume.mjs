const command = {
  name: 'vol',
  description: 'Aumenta ou diminui o volume da música.',
  exemple: `\n**Como usar:**\n\`\`\`${PREFIX}vol + (1 a 3)\`\`\``,
  execute([{ voiceChannel, args, streaming, embed, message: { channel, author } },]) {
    const songsProps = streaming.get(voiceChannel?.id)

    if (!voiceChannel || !songsProps?.connection) return

    let numberVol = Number(args[0])
    let description

    if (isNaN(numberVol) || numberVol < 0 || numberVol > 3) return channel.send(embed.setDescription(`<:alert:773624031626657833> <@${author.id}> Digite um numero de 0 a 3`))

    switch (numberVol) {
      case 0:
        description = '<:silentmode:633076689202839612>'
        break
      case 1:
        description = '<:lowvolume:633076130626404388>'
        break;
      case 2:
        description = '<:autovolume:633076130668085248>'
        break
      case 3:
        description = '\🥴  Volume máximo.'
        break
    }

    songsProps.broadcastDispatcher.setVolume(numberVol)
    channel.send(embed.setDescription(description))
  },
}

export default command