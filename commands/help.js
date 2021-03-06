const prefix = process.env.PREFIX
const implements = require('../modules/func_implements')
const commands = require('./commands')


module.exports = {
  name: "help",
  description: "Informa sobre os comandos e descreve o que cada um faz.",
  execute: async ([{ embed, args, message: { channel, author }, bot: { user } },]) => {

    if (args.length > 0) {
      let commandInfo

      if(commandInfo = commands.listCommands().get(args.join(" ").toLowerCase())) {
        embed
          .setTitle(`**${commandInfo.name}**`)
          .setDescription(`${commandInfo.description}`)
  
        channel.send(embed)

      }
    } else {
      const commandsYt = commands
        .listCommands()
        .filter(cm => cm.name.startsWith("yt"))
        .map(cm => ({ name: `**${cm.name}**`, value: cm.description, inline: true }))

      const commandsSp = commands
        .listCommands()
        .filter(cm => cm.name.startsWith('spy'))
        .map(cm => ({ name: `**${cm.name}**`, value: cm.description, inline: true }))

      const commandsOthers = commands
        .listCommands()
        .filter(cm => !cm.name.startsWith('yt') && !cm.name.startsWith('spy'))
        .map(cm => ({ name: `**${cm.name}**`, value: cm.description, inline: true }))


      embed
        .setTitle("<:que:648555789119914005> **```Help```**")
        .setDescription(`Adicione o **\`\`${user.username}\`\`** em outros servidores [Convite](https://discordapp.com/oauth2/authorize?=&client_id=617522102895116358&scope=bot&permissions=8) \n\n**\`\`Prefixo:\`\`** ${prefix}`)
        .addField("<:music:648556667364966400> Comandos", "━━━━━━━━━━━", false)
        .addFields(
          { name: "**youtube**", value: "Categoria de comandos para youtube", inline: false },
          commandsYt,
          { name: "**Spotify**", value: "Categoria de comandos para Spotify", inline: false },
          commandsSp,
          { name: "**Outros**", value: "Outras categorias de comandos", inline: false },
          commandsOthers
        )
        .setFooter(`${author.username} ✦ ${implements.getDate()} ás ${implements.getTimeStamp()}`, author.avatarURL());

      (await channel.send(embed)).delete({ timeout: 55000 })
    }


  }
}