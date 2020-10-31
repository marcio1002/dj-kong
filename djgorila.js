const Discord = require("discord.js")
const bot = new Discord.Client
const commands = require("./src/commands/commands")
const express = require("express")()
const port = process.env.PORT || 11826
const token = require("./config.json").token || process.env.TOKEN
const prefix = require("./config.json").prefix || process.env.PREFIX

bot.on("ready", () => (
    console.clear(), 
    console.log(`Bot Online, com ${bot.users.cache.size} usuários, ${bot.channels.cache.size} canais e ${bot.guilds.cache.size} servidores.`),
    bot.user.setPresence({ activity: {name: "Digite !dhelp para mais informações.",type: "PLAYING",}, status: "online"})
))

bot.on("guildDelete", guild => console.info(`O bot foi removido do servidor: ${guild.name} \nid: ${guild.id}`))

bot.on('message', async message => {
    const {content, mentions, guild, member} = message
    const embed = (new Discord.MessageEmbed()).setColor("#B955D4")

    if ([`<@!${bot.user.id}>`,`<@${bot.user.id}>`].includes(content)) {
        embed
            .setTitle(`Olá ${message.author.username}! \nMeu nome é ${bot.user.username} logo a baixo tem minha descrição:`)
            .setDescription("**prefixo:** **``!d``** \n **função do Ondisco:** **``Deixando seu dia/sua noite mais feliz tocando sua música favorita``** \n **Criador do Ondisco:** **``Marcio#1506``** \n[Copyright (C) 2000 Aladdin Enterprises](https://github.com/marcio1002/bot-Ondisco/blob/master/LICENCE.md)");
        (await message.channel.send(embed)).delete({ timeout: 25000 })
    }
    if (message.author.bot || message.channel.type === "dm" || !message.content.toLowerCase().startsWith(prefix)) return    
    
    const
        mentionUser = mentions.users.first()
        memberMentions = guild.member(mentionUser)
        args = content.toLowerCase().slice(prefix.length).trim().split(/ +/g)
        command = args.shift()
            
        let messageProps =  {
        embed,
        message,
        args,
        bot,
        mentionUser,
        memberMentions,
        voiceChannel: member.voice.channel,
    }
    commands.findCommand(command, messageProps)
})

express.listen(port)
bot.login(token)
