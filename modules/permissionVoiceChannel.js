const permissionVoiceChannel = ([messageProps,]) => {
  const { voiceChannel, bot, message: { channel, author } } = messageProps
  let botPermission

  if (!voiceChannel) {
    channel.send(`<:alert:773624031626657833> <@${author.id}> só posso reproduzir o aúdio se você estiver conectado em um canal de voz.`)
    return false
  }

  if (!(botPermission = voiceChannel.permissionsFor(bot.user.id).serialize())) return false
  
  if (!botPermission["CONNECT"])  {
    channel.send(`<:error:773623679459262525> <@${author.id}> não tenho permissão para conectar nesse canal de voz`)
    return false
  }
  if (!botPermission["SPEAK"] || !voiceChannel.speakable) {
    channel.send(`<:error:773623679459262525> <@${author.id}> não tenho permissão para falar nesse canal de voz`)
    return false
  }
  if (voiceChannel.muted) {
    channel.send(`<@${author.id}>  não posso enviar audio nesse canal de voz, canal de voz mudo.`)
    return false
  }

  return true
}

module.exports  = permissionVoiceChannel