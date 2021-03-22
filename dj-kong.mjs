import 'dotenv/config.js'
import express from 'express'
import Discord from 'discord.js'
import commands from './commands/commands.mjs'
import helpers from './modules/helpers.mjs'
import propsState from'./modules/propsState.mjs'

const app = express()
const bot = new Discord.Client
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
    const embed = (new Discord.MessageEmbed()).setColor(helpers.colorRadomEx())

    if ((new RegExp(`<@!?${bot.user.id}>`,'ig')).test(content)) {
        embed
            .setTitle(`Olá ${message.author.username}! \nMeu nome é ${bot.user.username} logo a baixo tem minhas descrições:`)
            .setDescription(`**prefixo:** **\`\`${prefix}\`\`** \n **função:** **\`\`Fazer seu dia/sua noite mais feliz tocando suas músicas favoritas\`\`** \n **Criado por:** **\`\`Marcio#1506\`\`** \n[Copyright (C) 2021 Aladdin Enterprises](https://github.com/marcio1002/bot-Ondisco/blob/master/LICENCE.md)`);
        return (await message.channel.send(embed)).delete({ timeout: 25000 })
    }
    
    if (message.author.bot || message.channel.type === "dm" || !message.content.toLowerCase().startsWith(prefix)) return

    const
        mentionUser = mentions.users.first(),
        memberMentions = guild.member(mentionUser),
        args = content.slice(prefix.length).trim().split(/ +/g),
        command = args.shift().toLowerCase()

    const useProps = propsState({
        songs: new Map([
            ['queues', []],
            ['current', null],
            ['played', null],
            ['speaking', false]
        ])
    })

    useProps[0].embed = (new Discord.MessageEmbed()).setColor(helpers.colorRadomEx())
    useProps[0].message = message
    useProps[0].voiceChannel = member.voice.channel
    useProps[0].broadcast = bot.voice.createBroadcast()
    useProps[0].args = args
    useProps[0].bot = bot
    useProps[0].mentionUser = mentionUser
    useProps[0].memberMentions = memberMentions

    useProps[1](useProps[0])

    if (!commands.has(command)) return

    commands.get(command, useProps)
})

app.get("/", (_, res) => res.status(200).send("ok"))

bot.login(token)

app.listen(port, (console.clear(), console.log(`http://${host}:${port}`)))

