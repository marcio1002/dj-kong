module.exports = {
  name: "ytvol",
  description: "Aumenta ou diminui o volume da reprodução que está tocando no momento.",
  execute({ voiceChannel, args, embed, message: { channel, author } }) {

    if (!voiceChannel || !conn || !args || isNaN(Number(args[0]))) return

    let numberVol = Number(args[0])
    let description

    if (numberVol < 0 || numberVol > 3) return channel.send(embed.setDescription(`<:erro:630429351678312506> <@${author.id}> Digite um numero de 0 a 3`))

    switch (numberVol) {
      case 0:
        description = "<:silentmode:633076689202839612>"
        break
      case 1:
        description = "<:lowvolume:633076130626404388>"
        break;
      case 2:
        description = "<:autovolume:633076130668085248>"
        break
      case 3:
        description = "\🥴  Volume máximo, Não recomendo a altura desse volume"
        break
    }

    dispatcher.setVolume(numberVol)
    channel.send(embed.setDescription(description))
  },
}