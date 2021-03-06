require("dotenv/config")
const Discord = require("discord.js")
const bot = new Discord.Client
const commands = require("./commands/commands")
const implements = require("./modules/func_implements")
const propsState = require("./modules/propsState")
const express = require("express")()
var port = process.env.PORT || Math.floor(Math.random() * 9999)
var token = process.env.SECRET
var prefix = process.env.PREFIX
var host = process.env.HOST ?? "0.0.0.0"


bot.on("ready", () => {
    commands.set()
    bot.user.setPresence({ activity: { name: `Digite ${prefix}help para visualizar o menu de comandos.`, type: "PLAYING", }, status: "online" })
    console.info(`Bot Online, com ${bot.users.cache.size} usuários, ${bot.channels.cache.size} canais e ${bot.guilds.cache.size} servidores.`)
})

bot.on("guildDelete", guild => console.info(`O bot foi removido do servidor: ${guild.name} \nid: ${guild.id}`))

bot.on('message', async message => {
    const { content, mentions, guild, member } = message
    const embed = (new Discord.MessageEmbed()).setColor(implements.colorRadomEx())

    if ((new RegExp(`<@!?${bot.user.id}>`,'ig')).test(content)) {
        embed
            .setTitle(`Olá ${message.author.username}! \nMeu nome é ${bot.user.username} logo a baixo tem minhas descrições:`)
            .setDescription(`**prefixo:** **\`\`${prefix}\`\`** \n **função:** **\`\`Fazer seu dia/sua noite mais feliz tocando suas músicas favoritas\`\`** \n **Criado por:** **\`\`Marcio#1506\`\`** \n[Copyright (C) 2000 Aladdin Enterprises](https://github.com/marcio1002/bot-Ondisco/blob/master/LICENCE.md)`);
        (await message.channel.send(embed)).delete({ timeout: 25000 })
    }
    if (message.author.bot || message.channel.type === "dm" || !message.content.toLowerCase().startsWith(prefix)) return

    const
        mentionUser = mentions.users.first()
        memberMentions = guild.member(mentionUser)
        args = content.slice(prefix.length).trim().split(/ +/g)
        command = args.shift().toLowerCase()

    const useProps = propsState({
        songs: new Map([
            ['queues', []],
            ['current', null],
            ['played', []],
            ['speaking', false]
        ])
    })

    useProps[0].embed = embed
    useProps[0].message = message
    useProps[0].voiceChannel = member.voice.channel
    useProps[0].args = args
    useProps[0].bot = bot
    useProps[0].mentionUser = mentionUser
    useProps[0].memberMentions = memberMentions

    useProps[1](useProps[0])

    if (!commands.has(command)) return

    commands.get(command, useProps)
})

express.get("/", (_, res) => res.send("ok"))

express.listen(port, (console.clear(), console.log(`http://${host}:${port}`)))

bot.login(token)
