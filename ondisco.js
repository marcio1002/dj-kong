const Discord = require("discord.js")
const bot = new Discord.Client()
const comands =  require("./src/comands/comands")
const config = require("./config.json")
const express = require("express")
const port = process.env.PORT || 3539
const token = (config.token)? config.token : process.env.TOKEN
const prefix = (config.prefix)? config.prefix : process.env.PREFIX 

bot.on("ready", () => console.log(`Bot Online, com ${bot.users.cache.size} usuários, ${bot.channels.cache.size} canais e ${bot.guilds.cache.size} servidores.`))


bot.on("presenceUpdate", async () => bot.user.setActivity("Digite !dhelp para mais informações."))

bot.on("guildCreate", guild => {
    console.info(`O bot entrou  no servidor: ${guild.name} (id ${guild.id}). população: ${guild.memberCount} membros.`)
    bot.user.setActivity(`Estou em ${bot.guilds.cache.size} servidores`)
})

bot.on("guildDelete", guild => console.info(`O bot foi removido do servidor: ${guild.name} \nid: ${guild.id}`))


bot.on('message', async message => {
   
    if (message.author.bot || message.channel.type === "dm") return

    const
        embedHelp = new Discord.MessageEmbed()
        .setColor("#B955D4")
        .setFooter(bot.user.username, bot.user.avatarURL())

    const    
        embedSong = new Discord.MessageEmbed()
        .setColor("#B955D4")
        .setFooter(bot.user.username, bot.user.avatarURL())
            
    if (message.content === "<@!617522102895116358>" || message.content === "<@617522102895116358>") {

        embedSong
            .setTitle(`Olá ${message.author.username}! \nMeu nome é Ondisco logo a baixo tem minha descrição:`)
            .setDescription("**prefixo:** **``!d``** \n **função do Ondisco:** **``Divertir os usuários do Discord tocando músicas nos canais de voz``** \n **Criador do Ondisco:** **``Marcio#1506``**")
            .setFooter("Copyright (C) 2000 Aladdin Enterprises, EUA Todos os direitos reservados.")
        const  msg = await message.channel.send(embedSong)
        msg.delete({timeout: 25000})
    }
    if (!message.content.startsWith(prefix)) return
    const 
        mentionUser = message.mentions.users.first()
        memberMentions = message.guild.member(mentionUser)
        args = message.content.slice(prefix.length).trim().split(/ +/g)
        req = args.shift().toLowerCase()
    

   let  messageProps = {
        embedHelp,
        embedSong,
        message,
        args,
        bot,
        mentionUser,
        memberMentions,
        voiceChannel: message.member.voice.channel,
    }

    const func_comands = {

        "avatar": () => comands.avatar(messageProps),
        
        "server": () => comands.server(messageProps),

        "help": () => comands.help(messageProps),

        "play": () => comands.play(messageProps),

        "leave": () => comands.leave(messageProps),

        "pause": () => comands.pause(messageProps),

        "back": () => comands.back(messageProps),

        "stop": () => comands.stop(messageProps),

        "vol": () => comands.vol(messageProps),

        "skip": () => comands.skip(messageProps),

        "list": () => comands.list(messageProps),
    }

    if (func_comands[req]) func_comands[req]()

    

})

express().listen(port)
bot.login(token)
