import Discord from 'discord.js'
import helpers from '../modules/helpers.mjs'
import commands from './commands.mjs'

const prefix = process.env.PREFIX


const command = {
  name: 'help',
  description: `Mostra o menu de ajuda \n\`${prefix}help ou ${prefix}help + comando\`.`,
  execute: async ([{ embed, args, message: { channel, author }, bot: { user } },]) => {
    let commandInfo, msg = null

    if (args.length > 0) {
      if (commandInfo = commands.getHelpCommands().get(args.join(' ').toLowerCase())) {
        embed
          .setTitle(`**${commandInfo.name}**`)
          .setDescription(`${commandInfo.description}`);

        msg = await channel.send(embed)

        await msg.react('<:trash:824754345907585035>')
        command.closeHelp({ msg, author })
      }
    } else {
      commandInfo = commands.getHelpCommands()

      const commandsMusic = commandInfo
        .get('commandsMusic')
        .map(cm => ({ name: `**${cm.name}**`, value: cm.description, inline: true }))
        .reverse()


      const commandsOthers = commandInfo
        .get('commandsOthers')
        .map(cm => ({ name: `**${cm.name}**`, value: cm.description, inline: true }))


      msg = await channel.send(command.sendHelpEmbed(commandsOthers, { author, user }))

      await msg.react('\🕹')
      await msg.react('<:music:824766010363084800>')
      await msg.react('<:trash:824754345907585035>')

      command.commandsOthers({ commandsOthers, msg, author, user })
      command.commandsMusic({ commandsMusic, msg, author, user })
      command.closeHelp({ msg, author })
    }
  },
  
  commandsOthers({ commandsOthers, msg, author, user }) {
    const filter  = (reaction, msgAuthor) => reaction.emoji.name == '\🕹' && msgAuthor.id == author.id
    
    msg
      .createReactionCollector(filter, { time: 50000 })
      .on('collect', r => {
        r.users.remove(author.id)
        msg.edit({ content: '', embed: command.sendHelpEmbed(commandsOthers, { author, user }) })
      })
  },

  commandsMusic({ commandsMusic, msg, author, user }) {
    const filter = (reaction, msgAuthor) => reaction.emoji.id == '824766010363084800' && msgAuthor.id == author.id

    msg
      .createReactionCollector(filter, { time: 50000 })
      .on('collect', r => {
        r.users.remove(author.id)
        msg.edit({ content: '', embed: command.sendHelpEmbed(commandsMusic, { author, user }) })
      })
  },

  closeHelp({ msg, author }) {
    const filter = (reaction, msgAuthor) => reaction.emoji.id == '824754345907585035' && msgAuthor.id == author.id
    msg
      .createReactionCollector(filter, { time: 100000 })
      .on('collect', r => msg.delete())
  },

  sendHelpEmbed(commands, { author, user }) {
    return (new Discord.MessageEmbed())
      .setColor(helpers.colorRadomEx())
      .setTitle('<:que:648555789119914005> **```Help```**')
      .setDescription(`Adicione o **${user.username}** em outros servidores [Convite](https://discordapp.com/oauth2/authorize?=&client_id=617522102895116358&scope=bot&permissions=8) \n\n**\`\`Prefixo:\`\`** ${prefix}\n\n**\`Comandos\`**`)
      .addFields(commands)
  }
}


export default command