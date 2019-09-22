const discord = require("discord.js")
const client = new discord.Client()
const config = require("./config.json")
const express = require("express")
const path = require('path')
const port = process.env.PORT || 8080
const cool = require('cool-ascii-faces')
const ytdl = require('ytdl-core')
const mapa = new Map()



client.on("ready", () => {
    console.log(`Bot foi iniciado, com ${client.users.size} usuários, ${client.channels.size} canais e ${client.guilds.size} servidores.`)
})

client.on('error', console.error);

client.on("presenceUpdate", async presenceupdate => {
    await setTimeout(() => { client.user.setActivity(`😍 Eu estou em ${client.guilds.size} servidores. um bom começo você não acha ? . 😃 `) }, 8000)
    await setTimeout(() => { client.user.setActivity('Digite !dhelp para mais informações.') }, 36000)
})

client.on("guildCreate", guild => {
    console.log(`O bot entrou  no servidor: ${guild.name} (id ${guild.id}). população: ${guild.memberCount} membros.`)
    client.user.setActivity(`Estou em ${client.guilds.size} servidores`)
})

client.on("guildDelete", guild => {
    console.log(`O bot foi removido do servidor: ${guild.name} (id: ${guild.id})`)
    client.user.setActivity(`Servindo a ${client.guilds.size} servidores.`)
})


function colorRadom() {
    let letters = "0123456789024810"
    backgroundColor = ""
    for (let mcolor = 0; mcolor < 7; mcolor++) {
        backgroundColor += letters[Math.floor(Math.random() * 13)]
    }
    return backgroundColor
}

client.on("guildMemberAdd", async newmember => {
    canal = client.channels.get('622940693022638090')
    guild = client.guilds.get('565566718446141450')
    if (!guild) return
    if (newmember.user == client.user.bot) return

    let welcome = {
        "embed": {
            "title": newmember.user.tag,
            "color": colorRadom,
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
                "url": "https://cdn.dribbble.com/users/1029769/screenshots/3430845/hypeguy_dribbble.gif"
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

    const mentionUser = message.mentions.users.first()
    const memberMentions = message.guild.member(mentionUser)
    const argsUrl = message.content.split(' ')
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g)
    const comando = args.shift().toLowerCase()
    const serveFila = mapa.get(message.guild.id)

    comandoObject = {
        "!dping": `🏓 pong! A  latência  da API  é **${Math.round(client.ping)}** ms.`,
        "!d": message.author + " Você esqueceu dos argumentos, Digite ``!dhelp`` para saber mais.",
    }

    if (comandoObject[message.content]) {
        message.channel.send(comandoObject[message.content])
    }

    if (comando === "avatar") {
        if (mentionUser) {
            const embed = {
                "embed": {
                    "title": "avatar: ``" + memberMentions.user.username + "``",
                    "color": colorRadom(),
                    "timestamp": message.createdTimestamp,
                    "description": "**[Baixar a imagem](" + memberMentions.user.displayAvatarURL + ")**",
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
                    "color": colorRadom(),
                    "timestamp": message.createdTimestamp,
                    "description": "**[Baixar a imagem](" + message.author.displayAvatarURL + ")**",
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
    if (comando === "help") {
        const embed = {
            "embed": {
                "title": "**```Help```**",
                "description": "Adicione o **``Ondisco``** em outros servidores [Convite](https://discordapp.com/oauth2/authorize?=&client_id=617522102895116358&scope=bot&permissions=8) \n ----------------------------------------------------------",
                "color": colorRadom(),
                "timestamp": message.createdTimestamp,
                "footer": {
                    "icon_url": "https://cdn.discordapp.com/app-icons/617522102895116358/eb1d3acbd2f4c4697a6d8e0782c8673c.png?size=256",
                    "text": "Ondisco"
                },

                "fields": [
                    {
                        "name": "``ping``",
                        "value": "Comando para testar a latência da API do discord com o bot",
                    },
                    {
                        "name": "``avatar``",
                        "value": "Comando para visualizar o avatar do perfil",
                    },
                    {
                        "name": "\🙄",
                        "value": "Estamos em desenvolvimento do bot, por enquanto não temos muitas funções para o Ondisco."
                    },
                    {
                        "name": "Musicas",
                        "value": "Comando de musicas está em desenvolvimento, mas temos algumas funções.\n **OBS:** Se encontrar alguns problemas mandem um feedback e não se preocupe, ele está em desenvolvimento"
                    },
                    {
                        "name": "play",
                        "value": "Comando para iniciar a musica",
                        "inline": true
                    },
                    {
                        "name": "stop",
                        "value": "Comando para parar a musica",
                        "inline": true
                    }
                ]


            }
        }
        message.channel.send(embed)
    }
    const voiceChannel = message.member.voiceChannel
    if (comando === "play") {

        if (!voiceChannel) return message.channel.send(`❗Desculpe <@${message.author.id}> , Não te encontrei em nenhum canal de voz.`)
        const musicInfo = await ytdl.getInfo(argsUrl[1])
        const song = {
            title: musicInfo.title,
            url: musicInfo.video_url
        }
        if (voiceChannel) {
            if (!serveFila) {

                const filaConstruir = {
                    textChannel: message.channel,
                    voiceChannel: voiceChannel,
                    connection: null,
                    songs: [],
                    volume: 6,
                    playing: true
                }
                mapa.set(message.guild.id, filaConstruir)
                filaConstruir.songs.push(song)

                try {
                    const voiceConnection = await voiceChannel.join()
                    filaConstruir.connection = voiceConnection

                    if (!song) {
                        serveFila.voiceChannel.leave()
                        mapa.delete(guild.id)
                        return message.channel.send('Não encontrei nenhuma url.')
                    }

                    const musics = await voiceConnection.playStream(ytdl(song.url))

                    message.channel.send('Tocando 💿')
                        .on('end', () => {
                            serveFila.songs.shift()
                            serveFila.songs[0]
                        })

                        .on('error', error => {
                            console.log(error)
                        })
                    play(message.guild, filaConstruir.songs[0])
                } catch (error) {
                    console.log(`Não encontrei nenhuma musica ${error}`)
                    mapa.delete(message.guild.id)
                }

            } else {
                serveFila.songs.push(song)
                return message.channel.send(`**${song.title}** Foi adicionado a fila.`)
            }
            return undefined
        }

    }
    if (comando === "stop") {
        if (!client.voiceConnections) return
        if (!voiceChannel) return message.channel.send(`❗Desculpe <@${message.author.id}> , não posso parar a musica sem que você esteja  no canal de voz.`)
        voiceChannel.leave()
        return message.channel.send('musica parada')
    }
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

setTimeout(() => {
    console.log('node .')
}, 29000);
express()
    .use(express.static(path.join(__dirname, 'public')))
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')
    .get('/', (req, res) => res.render('pages/bot'))
    .get('/cool', (req, res) => res.send(cool()))
    .listen(port, () => console.log(`servidor está usando a porta ${port}`))
client.login(config.token)