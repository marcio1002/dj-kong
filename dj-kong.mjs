import 'dotenv/config.js'
import express from 'express'
import Discord from 'discord.js'
import commands from './commands/commands.mjs'
import helpers from './utils/helpers.mjs'
import { useState } from './utils/propsState.mjs'

const app = express()
const bot = new Discord.Client
const PORT = process.env.PORT || Math.floor(Math.random() * 9999)
const TOKEN = process.env.SECRET
const host = process.env.HOST ?? '0.0.0.0'
global.PREFIX = process.env.PREFIX

// let commandDelay = []


bot.on('ready', () => {
    commands.set()
    let members = 0
    bot.guilds.cache.each(u => { members += u.members.cache.size })
    bot.user.setPresence({activity: { type: 'LISTENING', name: `${bot.user.username}. Digite ${PREFIX}help para obter o menu de ajuda.` }, status: 'online' })
    console.info(`Bot Online com ${members} clientes, ${bot.channels.cache.size} canais e ${bot.guilds.cache.size} servidores.`)
})

bot.on('guildDelete', guild => console.info(`O bot foi removido do servidor: ${guild.name} \nid: ${guild.id}`))

bot.on('message', async message => {
    try {
        const { content, mentions, guild, member } = message
        const embed = (new Discord.MessageEmbed()).setColor(helpers.colorRadomEx())

        if ((new RegExp(`^<@!?${bot.user.id}>$`, 'ig')).test(content)) {
            embed
                .setTitle(`Olá ${message.author.username}! \nMeu nome é ${bot.user.username} logo a baixo tem minhas descrições:`)
                .setDescription(`**prefixo:** **\`\`${PREFIX}\`\`** \n **função:** **\`\`Fazer seu dia/sua noite mais feliz tocando suas músicas favoritas\`\`** \n **Criado por:** **\`\`Marcio#1506\`\`** \n[Copyright (C) 2021 Aladdin Enterprises](https://github.com/marcio1002/bot-Ondisco/blob/master/LICENCE.md)`);
            return (await message.channel.send(embed)).delete({ timeout: 25000 })
        }

        if (message.author.bot || message.channel.type === 'dm' || !message.content.toLowerCase().startsWith(PREFIX)) return

        const
            mentionUser = mentions.users.first(),
            memberMentions = guild.member(mentionUser),
            args = content.slice(PREFIX.length).trim().split(/ +/g),
            command = args.shift().toLowerCase()

        const useProps = useState({
            streaming: new Discord.Collection()
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
    } catch (ex) {
        console.log(`ERROR:\n${ex}`)
    }
})

app.get('/', (_, res) => res.status(200).send('ok'))

bot.login(TOKEN)

app.listen(PORT, (console.clear(), console.log(`http://${host}:${PORT}`)))

