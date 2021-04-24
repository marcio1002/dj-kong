const command = {
  name: 'emj',
  description: 'Envia emojis animados no canal de mensagens.',
  exemple: `\n**Como usar:**\n\`\`\`${PREFIX}emj \⏯ \n\nor \n\n${PREFIX}emj :emoji_animado:\`\`\``,
  execute: ([messageProps,]) => {
    const { bot, args, message: { channel, guild } } = messageProps
    let guildsEmoji, emoji, filter

    if (!args || args.length == 0) return channel.send(`Consulte o comando \`${PREFIX}help emj\` para saber como usar o comando.`)

    filter = emoji => emoji.name == args[0].match(/\w+[^\:\\;]/)

    emoji = guild.emojis.cache.find(filter) || guild.emojis.cache.get(args[0])

    bot.guilds.cache.find(guild => {
      const { emojis } = guild
      return (guildsEmoji = emojis.cache.find(filter) || emojis.cache.get(args[0]))
    })

    messageProps.message.delete({ time: 500 })

    if (emoji)
      channel.send(emoji.animated ? `<a:${emoji.name}:${emoji.id}>` : `<:${emoji.name}:${emoji.id}>`)
    else if (guildsEmoji)
      channel.send(guildsEmoji.animated ? `<a:${guildsEmoji.name}:${guildsEmoji.id}>` : `<:${guildsEmoji.name}:${guildsEmoji.id}>`)
  }
}

export default command