const discord = require("discord.js")
const client = new discord.Client()
const config = require("./config.json")
const express = require("express")
const path = require('path')
const port = process.env.PORT || 8080
const cool = require('cool-ascii-faces')
const ytdl = require('ytdl-core')
const mapa = new Map()
const token = process.env.token || config.token
const prefix = process.env.prefix || config.prefix
let embedMusic = new discord.RichEmbed()


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
    embedMusic.setTitle(newmember.user.tag)
        .setColor("#FFF100")
        .setTimestamp(canal.createdTimestamp)
        .setThumbnail(newmember.user.displayAvatarURL)
        .addField("**Você entrou no servidor:** " + newmember.guild.name + "\n **Com você temos:** ``" + newmember.guild.memberCount + "``", "____________________________________________________________________")
        .setImage("https://cdn.dribbble.com/users/1029769/screenshots/3430845/hypeguy_dribbble.gif")
        .setFooter("Ondisco", "https://cdn.discordapp.com/app-icons/617522102895116358/eb1d3acbd2f4c4697a6d8e0782c8673c.png?size=256")
            canal.send(` Bem vindo(a) !  \\😃  <@${newmember.user.id}>`, embedMusic)
            console.log(`novo membro \n Embed enviada no servidor ${newmember.guild.name}`)
})
client.on("message", async message => {
    if (message.author.bot) return
    if (message.channel.type === "dm") return
    if (!message.content.startsWith(prefix)) return;

    const mentionUser = message.mentions.users.first()
    const memberMentions = message.guild.member(mentionUser)
    const arguments = message.content.split(' ')
    const args = message.content.slice(prefix.length).trim().split(/ +/g)
    const comando = args.shift().toLowerCase()
    const voiceChannel = message.member.voiceChannel

    comandoObject = {
        "!d": message.author + " Você esqueceu dos argumentos, Digite ``!dhelp`` ",
    }

    if (comandoObject[message.content]) {
        message.channel.send(comandoObject[message.content])
    }
    switch (comando) {
        case "avatar":
            if (mentionUser) {
                embedMusic.setColor(colorRadomEx())
                    .setTitle("avatar: ``" + memberMentions.user.tag + "``")
                    .setTimestamp(message.createdTimestamp)
                    .setDescription(`<:image:633071783414726666>** [Baixar imagem](${memberMentions.user.displayAvatarURL})**`)
                    .setFooter("Ondisco", "https://cdn.discordapp.com/app-icons/617522102895116358/eb1d3acbd2f4c4697a6d8e0782c8673c.png?size=256")
                    .setImage(memberMentions.user.displayAvatarURL)
                    .setAuthor(message.author.tag, message.author.displayAvatarURL)

                message.channel.send(embedMusic)

            } else {
                embedMusic.setColor(colorRadomEx())
                    .setTimestamp(message.createdTimestamp)
                    .setDescription(`<:image:633071783414726666>** [Baixar imagem](${message.author.displayAvatarURL})**`)
                    .setFooter("Ondisco", "https://cdn.discordapp.com/app-icons/617522102895116358/eb1d3acbd2f4c4697a6d8e0782c8673c.png?size=256")
                    .setImage(message.author.displayAvatarURL)
                    .setAuthor(message.author.tag, message.author.displayAvatarURL)

                message.channel.send(embedMusic)
            }

            break;
        case "help":
            embedMusic.setColor("#AD25D7")
                .setTitle("**```Help```**")
                .setTimestamp(message.createdTimestamp)
                .setDescription("Adicione o **``Ondisco``** em outros servidores [Convite](https://discordapp.com/oauth2/authorize?=&client_id=617522102895116358&scope=bot&permissions=8) \n ----------------------------------------------------------")
                .setFooter("Ondisco", "https://cdn.discordapp.com/app-icons/617522102895116358/eb1d3acbd2f4c4697a6d8e0782c8673c.png?size=256")
                .addField("``avatar``", "Comando para visualizar o avatar do perfil")
                .addField("😀", "Comandos para ouvir musica \n **OBS:** Se encontrar algum problema mandem seu feedback  para Marcio#1506")
                .addBlankField()
                .addField("**``play``**","iniciar a musica",true)
                .addField("**``leave``**","Finalizar a musica e sair do canal",true)
                .addField("**``back``**","Continua a musica",true)
                .addField("**``pause``**","Pausa a musica",true)
                .addField("**``stop``**","Finaliza a musica",true)
                .addField("**``vol``**","Aumenta ou diminui o volume.\n **``Min:``** 0   **``Max:``** 4",true)
           
            message.channel.send(embedMusic)
            break;
        case "play":
            if (!voiceChannel) return message.channel.send(`<:erro:630429351678312506> Desculpe <@${message.author.id}> , Não te encontrei em nenhum canal de voz.`)
            if (voiceChannel.joinable == false || voiceChannel.speakable == false) return message.channel.send(`<:alert:630429039785410562> <@${message.author.id}> Não tenho permissão para ingressar ou enviar audio no canal de voz.`)
            if (voiceChannel.muted == true) return message.channel.send(`<@${message.author.id}>  não posso enviar audio no canal de voz, canal de voz mudo.`)
            if (!arguments[1]) return message.channel.send("<@" + message.author.id + "> Digite a url do vídeo. \n exe: ``!dplay https://youtu.be/t67_zAg5vvI`` ")
            let musicInfo = ytdl.getInfo(arguments[1])
            embedMusic.setColor(11347415)

            musicInfo.then((info) => {
                if (voiceChannel) {

                    try {
                        const voiceConnection = voiceChannel.join()

                        voiceConnection.then(connection => {
                            if (connection.speaking == true) {
                                connection.receivers.push(info.video_url)

                                embedMusic.setTitle('``' + info.title + '`` \n Foi adicionada na fila')
                                message.channel.send(embedMusic)
                            } else {
                                connection.receivers.push(info.video_url)
                                music = connection.playStream(ytdl(connection.receivers[0]))
                               
                                connection.dispatcher.stream.on('end', () => {
                                    connection.receivers.shift()
                                    if (!connection.receivers[0]) {
                                        return
                                    } else {
                                        music = connection.playStream(ytdl(connection.receivers[0]))
                                            
                                    }

                                })
                            }
                            connection.dispatcher.on("start", () => {
                                embedMusic.setTitle('Tocando <a:Ondisco:630470764004638720> ``' + info.title + '``')
                                message.channel.send(embedMusic)
                            })

                        })
                        voiceConnection.catch(error => console.log(`Tipo de erro: ${error}`))

                    } catch (error) {
                        console.log(`Tipo de erro: ${error}`)
                        return undefined
                    }
                }

            })
            musicInfo.catch(console.error)
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
        case "vol":
            if (!voiceChannel.connection) return message.channel.send(`<:erro:630429351678312506> <@${message.author.id}> Não estou conectado no canal de voz para conceder essa função`)
            if (!voiceChannel) return
            let numberVol = parseInt(arguments[1])
            embedMusic.setColor(colorRadomEx())
            switch (numberVol) {
                case 0:
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
                    embedMusic.setDescription("<:alert:630429039785410562>Volume máximo, Não recomendo a altura desse volume")
                    message.channel.send(embedMusic)
                    break;
                default:
                    voiceChannel.connection.dispatcher.setVolume(1)
                break;
            }
            return (numberVol >= 0 && numberVol <= 4) ? voiceChannel.connection.dispatcher.setVolume(arguments[1]) : message.channel.send(`<:erro:630429351678312506> <@${message.author.id}> Digite um numero de 0 a 4`)
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

// client.on('raw', console.log)
express() 
    .listen(port, () => console.log(`servidor está usando a porta ${port}`))
client.login(token)