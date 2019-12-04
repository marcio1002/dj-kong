const discord = require("discord.js")
const client = new discord.Client()
const config = require("./config.json")
const express = require("express")
const port = process.env.PORT || 3232
const ytdl = require('ytdl-core')
const ytSearch = require('yt-search')
const mapa = new Map()
const token = process.env.token || config.token
const prefix = process.env.prefix || config.prefix



client.on("ready", () => {
    console.log(`Bot Online, com ${client.users.size} usuários, ${client.channels.size} canais e ${client.guilds.size} servidores.`)
})

client.on('error', console.error);

client.on("presenceUpdate", async presenceupdate => {
    await setTimeout(() => { client.user.setActivity(`😍 Eu estou em ${client.guilds.size} servidores. um bom começo você não acha ? . 😃 `) }, 22000)
    await setTimeout(() => { client.user.setActivity('Digite !dhelp para mais informações.') }, 40000)
})

client.on("guildCreate", guild => {
    console.log(`O bot entrou  no servidor: ${guild.name} (id ${guild.id}). população: ${guild.memberCount} membros.`)
    client.user.setActivity(`Estou em ${client.guilds.size} servidores`)
})

client.on("guildDelete", guild => {
    console.log(`O bot foi removido do servidor: ${guild.name} \nid: ${guild.id}`)
    client.user.setActivity(`Agora estou em ${client.guilds.size} servidores.`)
})

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

    let embed = new discord.RichEmbed()
    embed.setTitle(newmember.user.tag)
        .setColor("#FFF100")
        .setTimestamp(canal.createdTimestamp)
        .setThumbnail(newmember.user.displayAvatarURL)
        .setDescription("**Você entrou no servidor:** **``" + newmember.guild.name + "``** \n**Com você temos:** **``" + newmember.guild.memberCount + "`` membros 🥳**")
        .setImage("https://cdn.dribbble.com/users/1029769/screenshots/3430845/hypeguy_dribbble.gif")
        .setFooter("Ondisco", "https://cdn.discordapp.com/app-icons/617522102895116358/eb1d3acbd2f4c4697a6d8e0782c8673c.png?size=256")

    canal.send(` Bem vindo(a) !  \\😃  <@${newmember.user.id}>`, embedMusic)
    console.log(`Novo membro \nEmbed enviada no servidor ${newmember.guild.name}`)
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
    const embedMusic = new discord.RichEmbed()

    argsObject = {
        "!d": message.author + " Você esqueceu dos argumentos, Digite ``!dhelp`` ",
    }

    if (argsObject[message.content]) {
        message.channel.send(comandoObject[message.content])
    }
    switch (comando) {
        case "avatar":
            const embedavatar = new discord.RichEmbed() 
            if (mentionUser) {
                embedMusic.setColor(colorRadomEx())
                    .setTimestamp(message.createdTimestamp)
                    .setDescription(`<:image:633071783414726666>** [Baixar avatar](${memberMentions.user.displayAvatarURL})**`)
                    .setFooter("Ondisco", "https://cdn.discordapp.com/app-icons/617522102895116358/eb1d3acbd2f4c4697a6d8e0782c8673c.png?size=256")
                    .setImage(memberMentions.user.displayAvatarURL)
                    .setAuthor(message.author.tag, message.author.displayAvatarURL)
            } else {
                embedMusic.setColor(colorRadomEx())
                    .setTimestamp(message.createdTimestamp)
                    .setDescription(`<:image:633071783414726666>** [Baixar avatar](${message.author.displayAvatarURL})**`)
                    .setFooter("Ondisco", "https://cdn.discordapp.com/app-icons/617522102895116358/eb1d3acbd2f4c4697a6d8e0782c8673c.png?size=256")
                    .setImage(message.author.displayAvatarURL)
                    .setAuthor(message.author.tag, message.author.displayAvatarURL)
            }
            message.channel.send(embedMusic)
            break;
        case "help":
           const embedHelp = new discord.RichEmbed() 
            embedHelp.setColor("#AD25D7")
                .setTitle("**```Help```**")
                .setTimestamp(message.createdTimestamp)
                .setDescription("Adicione o **``Ondisco``** em outros servidores [Convite](https://discordapp.com/oauth2/authorize?=&client_id=617522102895116358&scope=bot&permissions=8) \n ----------------------------------------------------------")
                .setFooter("Ondisco", "https://cdn.discordapp.com/app-icons/617522102895116358/eb1d3acbd2f4c4697a6d8e0782c8673c.png?size=256")
                .addField("``avatar``", "Comando para visualizar o avatar do perfil")
                .addField("😀", "Comandos para ouvir musica \n **OBS:** Se encontrar algum problema mandem seu feedback  para Marcio#1506")
                .addBlankField()
                .addField("**``play``**", "inicia a música", true)
                .addField("**``leave``**", "Finalizar a música e sai do canal", true)
                .addField("**``back``**", "Continua a música pausada", true)
                .addField("**``pause``**", "Pausa a música", true)
                .addField("**``stop``**", "Finaliza a música", true)
                .addField("**``vol``**", "Aumenta ou diminui o volume.\n **``Min:``** 0   **``Max:``** 4", true)
                .addField("**``skip``**", "pula a música que está tocando no momento", true)

            const m = await message.channel.send(embedHelp)
            m.delete(35000)
            break;
        case "play":
            if (!voiceChannel) return message.channel.send(`<:erro:630429351678312506> Desculpe <@${message.author.id}> , Não te encontrei em nenhum canal de voz.`)
            if (voiceChannel.joinable == false || voiceChannel.speakable == false) return message.channel.send(`<:alert:630429039785410562> <@${message.author.id}> Não tenho permissão para ingressar ou enviar audio no canal de voz.`)
            if (voiceChannel.muted == true) return message.channel.send(`<@${message.author.id}>  não posso enviar audio no canal de voz, canal de voz mudo.`)
            arguments.shift()
            if (!arguments[0]) return message.channel.send("<@" + message.author.id + "> Digite a o nome da musica que deseja tocar. \n exe: ``!dplay Eminem Venom `` ")
            embedMusic.setColor("#A331B6")
            ytSearch(arguments.join(" "), async function (err, videoInfo) {
                if (err) console.log(err)
                const listVideos = videoInfo.videos
                let option = 1
                let cont = 1
                optionTitle = []
                const optEmbed = new discord.RichEmbed()
                optEmbed.setTitle("Qual musica você deseja tocar ? \n digite um numero entre ``1`` a ``10`` ")
                    .setColor('#B955D4')
                for (const video of listVideos) {
                    optionTitle.push("** " + option + "** -> **``" + video['title'] + "``** \n")
                    option = option + 1;
                    if (cont == 10) break
                    cont = cont + 1;
                }
                const filter = respon => respon.author.id === message.author.id

                optEmbed.setDescription(optionTitle)
                const msg = await message.reply(optEmbed)
                msg.delete(40000)

                message.channel.awaitMessages(filter, {
                    max: 1,
                    time: 40000
                }).then(async sellect => {
                    if (sellect.first().content) {
                        selectOption(sellect.first().content)
                        try {
                            let music = listVideos[op]
                            if (music) {
                                const voiceConnection = voiceChannel.join()
                                voiceConnection.then(async connection => {
                                    await playMusic(connection, music)
                                })
                                voiceConnection.catch(console.error)
                            }

                        } catch (error) {
                            console.log(`Tipo de erro: ${error}`)
                            return undefined
                        }
                    }
                })
                    .catch(console.error)
            })
            break;
        case "leave":
            if (!voiceChannel.connection) return message.channel.send(`<@${message.author.id}>, <:huuum:648550001298898944> não posso sair do canal de voz ,se eu não estou nele.`)
            if (!voiceChannel) return message.channel.send(` <:erro:630429351678312506> Desculpe <@${message.author.id}> , não posso sair do canal de voz você está ausente.`)
            embedMusic.setTitle("Desconectado do canal ``" + voiceChannel.name + "``")
                .setColor(colorRadomEx())
            voiceChannel.connection.disconnect()
            message.channel.send(embedMusic)

            break;
        case "pause":
            if (!voiceChannel.connection) return message.channel.send(`<:erro:630429351678312506> <@${message.author.id}> Não estou conectado no canal de voz para conceder essa função`)
            if (!voiceChannel) return message.channel.send(` <:erro:630429351678312506> Desculpe <@${message.author.id}> , não posso pausar a musica você está ausente no canal de voz`)
            embedMusic.setColor(colorRadomEx())
            embedMusic.setDescription("<:pause:633071783465058334> paused")
            if (voiceChannel.connection.speaking == true) {
                voiceChannel.connection.dispatcher.pause()
                message.channel.send(embedMusic)
            } else {
                return message.channel.send(`<@${message.author.id}>  <:huuum:648550001298898944> nenhuma musica tocando nesse canal!`)
            }

            break;
        case "back":
            if (!voiceChannel.connection) return message.channel.send(`<:erro:630429351678312506> <@${message.author.id}> Não estou conectado no canal de voz para conceder essa função`)
            if (!voiceChannel) return
            embedMusic.setDescription("<:play:633088252940648480> ")
                .setColor(colorRadomEx())

            if (voiceChannel.connection.dispatcher.paused == true) {
                voiceChannel.connection.dispatcher.resume()
                message.channel.send(embedMusic)
            } else {
                return console.log("erro! não pode continuar a musica pausada")
            }
            break;
        case "stop":
            if (!voiceChannel.connection) return message.channel.send(`<:erro:630429351678312506> <@${message.author.id}> Não estou conectado no canal de voz para conceder essa função`)
            if (!voiceChannel) return
            embedMusic.setDescription("<:stop:648561120155795466> stop")
            if (voiceChannel.connection.speaking == true) {
                voiceChannel.connection.dispatcher.end()
                return message.channel.send(embedMusic)
            } else {
                return message.channel.send(`<@${message.author.id}> <:huuum:648550001298898944> nenhuma musica tocando nesse canal!`)
            }
            
        case "vol":
            let numberVol = parseInt(arguments[1])
            embedMusic.setColor(colorRadomEx())
            if (!voiceChannel.connection) return message.channel.send(`<:erro:630429351678312506> <@${message.author.id}> Não estou conectado no canal de voz para conceder essa função`)
            if (!voiceChannel || !numberVol) return

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
                    embedMusic.setDescription("\🥴  Volume máximo, Não recomendo a altura desse volume")
                    message.channel.send(embedMusic)
                    break;
                default:
                    voiceChannel.connection.dispatcher.setVolume(1)
                    break;
            }
            return (numberVol >= 0 && numberVol <= 4) ? voiceChannel.connection.dispatcher.setVolume(arguments[1]) : message.channel.send(`<:erro:630429351678312506> <@${message.author.id}> Digite um numero de 0 a 4`)
        case "skip":
            voiceChannel.connection.receivers.shift()
            console.log(voiceChannel.connection.receivers)
            if (!voiceChannel.connection.receivers[0]) {
                return
            } else {
                voiceChannel.connection.playStream(await ytdl(voiceChannel.connection.receivers[0]))
                embedMusic.setTitle("música pulada")
                    .setColor("#A331B6")
                message.channel.send(embedMusic)
                connection.dispatcher.stream.on("end", () => {
                    connection.receivers.shift()
                    if (!connection.receivers[0]) {
                        return
                    } else {
                        connection.playStream(ytdl(connection.receivers[0]))
                    }
                })
            }

            break;

            async function selectOption(arg) {
                const numbers = "123456789"
                if (!arg || arg == undefined) return message.channel.send(`Nenhuma opção escolhida`)
                if (arg.length > 2) return console.log("O tamanho do caractere foi excedido:" + arguments.length)
                if (arg == numbers.substring(0, numbers.length)) return console.log("Só é aceito números")
                const option = Number(arg) - 1
                op = option;
            }

            async function playMusic(connection, music) {
                if (connection.receivers[0]) {
                    connection.receivers.push("https://www.youtube.com" + music['url'])
                    embedMusic.setTitle(' ``' + music['title'] + '`` foi adicionada na fila')
                    message.channel.send(embedMusic)
                } else {
                    connection.receivers.push("https://www.youtube.com" + music['url'])
                    connection.playStream(ytdl(connection.receivers[0]))
                    connection.dispatcher.on("start", () => {
                        embedMusic.setTitle('Tocando <a:Ondisco:630470764004638720> ``' + music['title'] + '``')

                        message.channel.send(embedMusic)
                    })
                    connection.dispatcher.stream.on("end", () => {
                        connection.receivers.shift()
                        if (!connection.receivers[0]) {
                            return
                        } else {
                            connection.playStream(ytdl(connection.receivers[0]))
                        }
                    })

                }
            }
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
express()
    .listen(port, () => console.log(`servidor está usando a porta ${port}`))
client.login(token)