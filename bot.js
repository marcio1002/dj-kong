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
    console.log(`Bot Online, com ${client.users.size} usuários, ${client.channels.size} canais e ${client.guilds.size} servidores.`)
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
function colorRadomEx() {
    let letters = "123456789ABCDEFGH"
    color = "#"
    for (let c = 0; c < 6; c++) {
        color += letters[Math.floor(Math.random() * 12)]
    }
    return color
}

client.on("guildMemberAdd", async newmember => {
    canal = client.channels.get('622940693022638090')
    guild = client.guilds.get('565566718446141450')
    if (newmember.guild != guild) return
    if (newmember.user == client.user.bot) return

    let welcome = {
        "embed": {
            "title": newmember.user.tag,
            "color": 16773376,
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
    console.log(`Embed enviada no servidor ${newmember.guild.name}`)
})
client.on("message", async message => {
    if (message.author.bot) return
    if (message.channel.type === "dm") return
    if (!message.content.startsWith(config.prefix)) return;

    const mentionUser = message.mentions.users.first()
    const memberMentions = message.guild.member(mentionUser)
    const arguments = message.content.split(' ')
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g)
    const comando = args.shift().toLowerCase()
    let embedMusic = new discord.RichEmbed()
    const voiceChannel = message.member.voiceChannel

    comandoObject = {
        "!d": message.author + " Você esqueceu dos argumentos, Digite ``!dhelp`` para saber mais.",
    }

    if (comandoObject[message.content]) {
        message.channel.send(comandoObject[message.content])
    }
    switch (comando) {
        case "avatar":
            if (mentionUser) {
                const embed = {
                        "embed": {
                            "title": "avatar: ``" + memberMentions.user.tag + "``",
                            "color": colorRadom(),
                            "timestamp": message.createdTimestamp,
                            "description": "<:image:633071783414726666>**[Baixar imagem](" + memberMentions.user.displayAvatarURL + ")**",
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
                

            } else {
                const embed = {
                            "embed": {
                                "color": colorRadom(),
                                "timestamp": message.createdTimestamp,
                                "description": "<:image:633071783414726666> **[Baixar imagem](" + message.author.displayAvatarURL + ")**",
                                "footer": {
                                    "icon_url": "https://cdn.discordapp.com/app-icons/617522102895116358/eb1d3acbd2f4c4697a6d8e0782c8673c.png?size=256",
                                    "text": "Ondisco"
                                },
                                "image": {
                                    "url": message.author.displayAvatarURL
                                },
                                "author": {
                                    "name": message.author.tag,
                                    "icon_url": message.author.displayAvatarURL
                                }
                            }
                        }
            }
                message.channel.send(embed)
        break;
        case "help":
            const embed = {
            "embed": {
                "title": "**```Help```**",
                "description": "Adicione o **``Ondisco``** em outros servidores [Convite](https://discordapp.com/oauth2/authorize?=&client_id=617522102895116358&scope=bot&permissions=8) \n ----------------------------------------------------------",
                "color": 11347415,
                "timestamp": message.createdTimestamp,
                "footer": {
                    "icon_url": "https://cdn.discordapp.com/app-icons/617522102895116358/eb1d3acbd2f4c4697a6d8e0782c8673c.png?size=256",
                    "text": "Ondisco"
                },
                "fields": [

                    {
                        "name": "``avatar``",
                        "value": "Comando para visualizar o avatar do perfil",
                    },
                    {
                        "name": "😀",
                        "value": "Comandos para ouvir musica \n **OBS:** Se encontrar algum problema mandem seu feedback e não se preocupe, ele está em desenvolvimento"
                    },

                    {
                        "name": "**play**",
                        "value": " iniciar a musica",
                        "inline": true
                    },
                    {
                        "name": "**leave**",
                        "value": "Finalizar a musica e sair do canal",
                        "inline": true
                    },
                    {
                        "name": "**back**",
                        "value": "Continuar a musica",
                        "inline": true
                    },
                    {
                        "name": "**pause**",
                        "value": "Pausar a musica",
                        "inline": true
                    },
                    {
                        "name": "**stop**",
                        "value": "Finalizar musica",
                        "inline": true
                    },
                    {
                        "name": "**vol**",
                        "value": "Aumentar ou diminuir o volume",
                        "inline": true
                    }

                ]
            }
        }
        message.channel.send(embed)
        break;
        case "play":
            if (!voiceChannel) return message.channel.send(`<:erro:630429351678312506> Desculpe <@${message.author.id}> , Não te encontrei em nenhum canal de voz.`)
            if (voiceChannel.joinable == false || voiceChannel.speakable == false) return message.channel.send(`<:alert:630429039785410562> <@${message.author.id}> Não tenho permissão para ingressar ou enviar audio no canal de voz.`)
            if (voiceChannel.muted == true) return message.channel.send(`<@${message.author.id}>  não posso enviar audio no canal de voz, canal de voz mudo.`)
            if (!arguments[1]) return message.channel.send("<@" + message.author.id + "> Digite a url do vídeo. \n exe: ``!dplay https://youtu.be/t67_zAg5vvI`` ")
            let musicInfo = ytdl.getInfo(arguments[1])

            musicInfo.then((info) => {
                if (voiceChannel) {
                    let filaConstruir = {
                        voiceChannel: voiceChannel,
                        connection: null,
                        songs: [],
                        volume: 0.8,
                        playing: true
                    }

                    filaConstruir.songs.push(info.video_url)
                    console.log(filaConstruir.songs)
                    try {
                        const voiceConnection = voiceChannel.join()
                        filaConstruir.connection = voiceConnection

                        voiceConnection.then(connection => {
                            if (connection.speaking == true) {
                                filaConstruir.songs.push(info.video_url)
                                message.channel.send(' ``' + info.title + '`` foi adicionada na fila')
                            } else {
                                music = connection.playStream(ytdl(filaConstruir.songs[0]))
                                embedMusic.setTitle('Tocando <a:Ondisco:630470764004638720> ``' + info.title + '``')
                                embedMusic.setColor(11347415)
                                message.channel.send(embedMusic)
                                    connection.on('end', () => {
                                        music = connection.playStream(ytdl(filaConstruir.songs[0]))
                                        message.channel.send(embedMusic)
                                    })
                            }

                        })
                        voiceConnection.catch(error => console.log(`Tipo de erro: ${error}`))

                    } catch (error) {
                        console.log(`Tipo de erro: ${error}`)
                        return undefined
                    }
                }

            })
        break;
        case "leave":
            if (!voiceChannel.connection) return message.channel.send(`<:erro:630429351678312506> <@${message.author.id}> Não estou conectado no canal de voz para conceder essa função`)
            if (!voiceChannel) return message.channel.send(` <:erro:630429351678312506> Desculpe <@${message.author.id}> , não posso parar a musica você está ausente no canal de voz.`)
            voiceChannel.connection.disconnect() 
        break;
        case "pause":
            if (!voiceChannel.connection) return message.channel.send(`<:erro:630429351678312506> <@${message.author.id}> Não estou conectado no canal de voz para conceder essa função`)
            if (!voiceChannel) return
            embedMusic.setColor(colorRadomEx())
            embedMusic.setDescription("<:pause:633071783465058334> Pausado")
            voiceChannel.connection.dispatcher.pause()
            message.channel.send(embedMusic)
        break;
        case "back":
            if (!voiceChannel.connection) return message.channel.send(`<:erro:630429351678312506> <@${message.author.id}> Não estou conectado no canal de voz para conceder essa função`)
            if (!voiceChannel) return
            embedMusic.setColor(colorRadomEx())
            embedMusic.setDescription("<:play:633088252940648480>")
            message.channel.send(embedMusic)
            return (voiceChannel.connection.dispatcher.paused == true) ? voiceChannel.connection.dispatcher.resume() : message.channel.send(`<:alert:630429039785410562> Esse comando é só usado quando a musica está pausada.`)
        case "stop":
            if (!voiceChannel.connection) return message.channel.send(`<:erro:630429351678312506> <@${message.author.id}> Não estou conectado no canal de voz para conceder essa função`)
            if (!voiceChannel) return
            embedMusic.setColor(colorRadomEx())
            embedMusic.setDescription("<:stop:633088253142106115> musica parada")
            voiceChannel.connection.dispatcher.end()
            return message.channel.send(embedMusic)
        case"vol":
            if (!voiceChannel.connection) return message.channel.send(`<:erro:630429351678312506> <@${message.author.id}> Não estou conectado no canal de voz para conceder essa função`)
            if (!voiceChannel) return
            let numberVol = parseInt(arguments[1])
            embedMusic.setColor(colorRadomEx())
            switch (numberVol) {
                case 0 || 0.0:
                    embedMusic.setDescription("<:silentmode:633076689202839612>")
                    message.channel.send(embedMusic)
                    break;
                case 1:
                    embedMusic.setDescription("<:lowvolume:633076130626404388>")
                    message.channel.send(embedMusic)
                    break;
                case 3:
                    embedMusic.setDescription("<:mediumvolume:633076130668085248>")
                    message.channel.send(embedMusic)
                    break;
                case 4:
                    embedMusic.setDescription("<:alert:630429039785410562> Não recomendo esse volume")
                    message.channel.send(embedMusic)
                    break;
                default:
                    console.error(error)
                    break;
            }
            return (numberVol <= 4) ? voiceChannel.connection.dispatcher.setVolume(arguments[1]) : message.channel.send(`<:erro:630429351678312506> <@${message.author.id}> Digite um numero de 0.1 a 4`) 
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
            console.log("removeu cargo")
            membro.removeRole(cargo1)
        } else if (dados.d.emoji.name === "🇧") {
            if (membro.roles.has(cargo2)) return
            console.log("Removeu cargo")
            membro.removeRole(cargo2)
        }
    }        

})

client.on('raw', console.log)
express()
    .use(express.static(path.join(__dirname, 'public')))
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')
    .get('/', (req, res) => res.render('pages/bot'))
    .get('/cool', (req, res) => res.send(cool()))
    .listen(port, () => console.log(`servidor está usando a porta ${port}`))
client.login(config.token)