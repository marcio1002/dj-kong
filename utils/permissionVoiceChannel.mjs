const permissionVoiceChannel = ([messageProps,]) => {
  const { voiceChannel, bot, embed, message: { channel, author } } = messageProps
  let botPermission

  if (!voiceChannel) {
    embed
      .setDescription(`<:alert:773624031626657833> <@${author.id}> só posso reproduzir o aúdio se você estiver conectado em um canal de voz.`)
    
      channel.send(embed)
    return false
  }

  if (!(botPermission = voiceChannel.permissionsFor(bot.user.id).serialize())) return false
  
  if (!botPermission["CONNECT"])  {
    embed
    .setDescription(`<:error:773623679459262525> <@${author.id}> não tenho permissão para conectar nesse canal de voz`)
    
    channel.send(embed)
    return false
  }
  if (!botPermission["SPEAK"] || !voiceChannel.speakable) {
    embed
      setDescription(`<:error:773623679459262525> <@${author.id}> não tenho permissão para falar nesse canal de voz`)

    channel.send(embed)
    return false
  }
  if (voiceChannel.muted) {
    embed
      .setDescription(`<@${author.id}>  não posso enviar audio nesse canal de voz, canal de voz mudo.`)

    channel.send(embed)
    return false
  }

  return true
}

export default permissionVoiceChannel