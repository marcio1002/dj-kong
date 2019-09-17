const discord = require("discord.js")
const client = new discord.Client()
const config = require("./config.json")
const express = require("express")
const path = require('path')
const port = process.env.PORT || 8181
const cool = require('cool-ascii-faces')


client.on("ready", () => {
    console.log(`Bot foi iniciado, com ${client.users.size} usuários, ${client.channels.size} canais e ${client.guilds.size} servidores.`)
})

client.on("presenceUpdate", async presenceupdate => {
    await setTimeout(() => { client.user.setActivity(`😍 Eu estou em ${client.guilds.size} servidores. um bom começo você não acha ? . 😃 `) }, 4000)
    await setTimeout(() => { client.user.setActivity('Digite !dhelp para mais informações.') }, 14000)
    console.log(client.user.username)
})

client.on("guildCreate", guild => {
    console.log(`O bot entrou  nos servidores: ${guild.name} (id ${guild.id}). população: ${guild.memberCount} membros.`)
    client.user.setActivity(`Estou em ${client.guilds.size} servidores`)
})

client.on("guildDelete", guild => {
    console.log(`O bot foi removido do servidor: ${guild.name} (id: ${guild.id})`)
    client.user.setActivity(`Servindo a ${client.guilds.size} servidores.`)
})

client.on("guildMemberAdd", async newmember => {
    if (newmember.user == client.user.bot) return
    canal = client.channels.get('622940693022638090')
    let numColor = Math.floor(Math.random() * (23234567 + 2 + 1 - 1))

    let welcome = {
        "embed": {
            "color": numColor,
            "timestamp": canal.createdTimestamp,
            "thumbnail": {
                "url": newmember.user.displayAvatarURL,
            },
            "fields": [
                {
                    "name": "**Você entrou no servidor:** " + newmember.guild.name + "\n **Região:** ``" + newmember.guild.region + "``",
                    "value": "____________________________________________________________________"
                }
            ],
            "image": {
                "url": "https://2.bp.blogspot.com/-jyZ34VySasQ/WonkFswP4WI/AAAAAAAAAXo/Nwo-jZExiMo4agIdDzNkJpTfxpS45EpbQCLcBGAs/s640/wumpus_dribbble.gif"
            },
            "footer": {
                "icon_url": "https://cdn.discordapp.com/app-icons/617522102895116358/eb1d3acbd2f4c4697a6d8e0782c8673c.png?size=256",
                "text": "Ondisco"
            },
        }
    }
    canal.send(` Bem vindo(a) !  \\😃  <@${newmember.user.id}>`, welcome)
    console.log('Embed enviada ao canal')
})

client.on("message", async message => {
    if (message.author.bot) return
    if (message.channel.type === "dm") return
    if (!message.content.startsWith(config.prefix)) return;
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g)
    const comando = args.shift().toLowerCase()
    const mentionUser = message.mentions.users.first()
    const memberMentions = message.guild.member(mentionUser)
    let numColor = Math.floor(Math.random() * (23234567  - 1))
    comandoObject = {
        "!dping": `🏓 pong! A  latência  da API  é **${Math.round(client.ping)}** ms.`,
        "!d": message.author + " Você esqueceu dos argumentos, Digite ``!dhelp`` para saber mais."
    }
    if (comandoObject[message.content]) {
        message.channel.send(comandoObject[message.content])
    }

    if (comando === "avatar") {

        if (mentionUser) {
            const embed = {
                "embed": {
                    "title": "avatar: ``" + memberMentions.user.username + "``",
                    "color": numColor,
                    "timestamp": message.createdTimestamp,
                    "footer": {
                        "icon_url": "https://cdn.discordapp.com/app-icons/617522102895116358/eb1d3acbd2f4c4697a6d8e0782c8673c.png?size=256",
                        "text": "Ondisco"
                    },
                    "image": {
                        "url": memberMentions.user.displayAvatarURL
                    },
                    "author": {
                        "name": message.author.username,
                        "icon_url": message.author.displayAvatarURL
                    }
                }
            }
            message.channel.send(embed)

        } else {
            const embed = {
                "embed": {
                    "color": numColor,
                    "timestamp": message.createdTimestamp,
                    "footer": {
                        "icon_url": "https://cdn.discordapp.com/app-icons/617522102895116358/eb1d3acbd2f4c4697a6d8e0782c8673c.png?size=256",
                        "text": "Ondisco"
                    },
                    "image": {
                        "url": message.author.displayAvatarURL
                    },
                    "author": {
                        "name": message.author.username,
                        "icon_url": message.author.displayAvatarURL
                    }
                }
            }
            message.channel.send(embed)
        }

    }
    // let role = message.guild.roles.find("name", "Admin")message.member.has(role.id)&&
    if (comando === "delete") {
        if (comando.args[0] == "") {
            message.channel.send('Digite o comando **mais** o numero para deletar as mensagens. n\ exe: !del 5')
        } else {

            let msgDelete = 5
            console.log(numbermsg)
           message.channel.fetchMessages({limit: msgDelete}). then(messages => message.channel.bulkDelete(messages))
        }

    }
    // if (!role) message.channel.send('Você não tem o cargo de admin ou moderador.')
})

client.on("raw", async dados => {
    if (dados.t !== "MESSAGE_REACTION_ADD" && dados.t !== "MESSAGE_REACTION_REMOVE") return
    if (dados.d.message_id != "617843012617109515" && dados.d.channel_id != "617843012617109515") return

    let servidor = client.guilds.get("565566718446141450")
    let membro = servidor.members.get(dados.d.user_id)
    let cargo1 = servidor.roles.get("571713968834347065")
    let cargo2 = servidor.roles.get("571713974626680842")

    if (dados.t === "MESSAGE_REACTION_ADD") {
        if (dados.d.emoji.name == "🅰") {
            if (membro.roles.has(cargo1)) return
            membro.addRole(cargo1)
        } else if (dados.d.emoji.name == "🇧") {
            if (membro.roles.has(cargo2)) return
            membro.addRole(cargo2)
        }
    }
    if (dados.t === "MESSAGE_REACTION_REMOVE") {
        if (dados.d.emoji.name === "🅰") {
            if (membro.roles.has(cargo1)) return
            console.log("Add cargo")
            membro.removeRole(cargo1)
        } else if (dados.d.emoji.name === "🇧") {
            if (membro.roles.has(cargo2)) return
            console.log("Removeu cargo")
            membro.removeRole(cargo2)
        }
    }
})

express()
    .use(express.static(path.join(__dirname, 'public')))
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')
    .get('/', (req, res) => res.render('pages/bot'))
    .get('/cool', (req, res) => res.send(cool()))
    .listen(port, () => console.log(`servidor está usando a porta ${port}`))
client.login(config.token)