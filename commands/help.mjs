import Discord from 'discord.js'
import helpers from '../modules/helpers.mjs'
import commands from './commands.mjs'

const prefix = process.env.PREFIX


const command = {
  name: "help",
  description: "Informa sobre os comandos e descreve o que cada um faz.",
  execute: async ([{ embed, args, message: { channel, author }, bot: { user } },]) => {
    let commandInfo, msg = null

    if (args.length > 0) {
      if (commandInfo = commands.listCommands().get(args.join(" ").toLowerCase())) {
        embed
          .setTitle(`**${commandInfo.name}**`)
          .setDescription(`${commandInfo.description}`)

        channel.send(embed)
      }
    } else {
      commandInfo = commands.listCommands()

      const commandsYt = commandInfo
        .filter(cm => cm.name.startsWith("yt"))
        .map(cm => ({ name: `**${cm.name}**`, value: cm.description, inline: true }))
        .reverse()

      const commandsSp = commandInfo
        .filter(cm => cm.name.startsWith('sp'))
        .map(cm => ({ name: `**${cm.name}**`, value: cm.description, inline: true }))
        .reverse()

      const commandsOthers = commandInfo
        .filter(cm => !cm.name.startsWith('yt') && !cm.name.startsWith('sp'))
        .map(cm => ({ name: `**${cm.name}**`, value: cm.description, inline: true }))


      msg = await channel.send(command.sendHelpEmbed(commandsOthers, { author, user }))

      msg.delete({ timeout: 40000 })

      await msg.react("\🕹")
      await msg.react("<:youtube:817569761881227315>")
      await msg.react("<:spotify:817569762178629693>")

      command.commandsOthers({commandsOthers, msg, author, user })
      command.commandsYoutube({commandsYt, msg, author, user })
      command.commandsSpotify({commandsSp, msg, author, user })

    }
  },
  
  commandsOthers({ commandsOthers, msg, author, user }) {
    const filter  = (reaction, msgAuthor) => reaction.emoji.name == "\🕹" && msgAuthor.id == author.id
    
    msg
      .awaitReactions(filter, { max: 1, maxUsers: 1, time: 30000 })
      .then(r => msg.edit({ content: "", embed: command.sendHelpEmbed(commandsOthers, { author, user }) }))
  },

  commandsYoutube({ commandsYt, msg, author, user }) {
    const filter = (reaction, msgAuthor) => reaction.emoji.id == "817569761881227315" && msgAuthor.id == author.id

    msg
      .awaitReactions(filter, { max: 1, maxUsers: 1, time: 30000 })
      .then(r => msg.edit({ content: "", embed: command.sendHelpEmbed(commandsYt, { author, user }) }))
  },

  commandsSpotify({ commandsSp, msg, author, user }) {
    const filterEmojiSpotify = (reaction, msgAuthor) => reaction.emoji.id == "817569762178629693" && msgAuthor.id == author.id

    msg
      .awaitReactions(filterEmojiSpotify, { max: 1, maxUsers: 1, time: 30000 })
      .then(r => msg.edit({ content: "", embed: command.sendHelpEmbed(commandsSp, { author, user }) }))
  },

  sendHelpEmbed(data, { author, user }) {
    return (new Discord.MessageEmbed())
      .setColor(helpers.colorRadomEx())
      .setTitle("<:que:648555789119914005> **```Help```**")
      .setDescription(`Adicione o **\`\`${user.username}\`\`** em outros servidores [Convite](https://discordapp.com/oauth2/authorize?=&client_id=617522102895116358&scope=bot&permissions=8) \n\n**\`\`Prefixo:\`\`** ${prefix}`)
      .addField("<:music:648556667364966400> Comandos", "━━━━━━━━━━━", false)
      .addFields(data)
      .setFooter(`${author.username} ✦ ${helpers.getDate()} ás ${helpers.getTimeStamp()}`, author.displayAvatarURL({ size: 512, dynamic: true }));
  }
}


export default command