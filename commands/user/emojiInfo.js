module.exports = {
  name: "emjif",
  description: "Mostra informações do emoji.",
  execute: ([messageProps,]) => {
    const { args , message:{ channel, guild } } = messageProps

    if (!args || args.length == 0) return channel.send('Digite ou cole o emoji\nexem: ``!dreact :emoji:``')
    const emoji = guild.emojis.cache.find(emoji => emoji.name == args[0].match(/\w+[^\:\\;]/) || emoji.name == args[0].replace(/\w\d\S/g, '\$1'))


    messageProps.message.delete({ time: 500 })

    if (emoji) channel.send(`**Nome:** \`\`${emoji.name}\`\`\n**Id:** \`\`${emoji.id}\`\``)
  }
}