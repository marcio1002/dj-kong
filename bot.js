const discord = require("discord.js")
const client = new discord.Client()
const config = require("./config.json")
const jimp = require('jimp')


client.on("ready", () => {
    console.log(`Bot foi iniciado, com ${client.users.size} usuários, ${client.channels.size} canais e ${client.guilds.size} servidores.`)
})

client.on("presenceUpdate", async presenceupdate => {
    await setTimeout(() => { client.user.setActivity(`😍 Eu estou em ${client.guilds.size} servidores. um bom começo você não acha ? . 😃 `) }, 4000)
    await setTimeout(() => { client.user.setActivity('Digite !dhelp para mais informações.') }, 14000)
    return presenceupdate
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
    let servidor = client.guilds.get('565566718446141450')

    if (newmember.guild == servidor) {
        let canal = await client.channels.get("622940693022638090")
        let font = await jimp.loadFont(jimp.FONT_SANS_64_WHITE)
        let mascara = await jimp.read('img/mascara.png')
        let fundo = await jimp.read('img/wumpus.gif')

        jimp.read(newmember.user.displayAvatarURL)
            .then(avatar => {
                avatar.resize(280, 280)
                mascara.resize(280, 280)
                avatar.mask(mascara)
                fundo.print(font, 60, 60, 'Bem vindo! ' + newmember.user.username)
                fundo.composite(avatar, 80, 190).write("img/avatar.png")
                canal.send(``, { files: ['img/avatar.png'] })
                console.log('imagem enviada pro discord.')
            })
            .catch(err => {
                console.log('erro não foi possível mostrar a imagem')
            })
    }
})

client.on("message", async message => {
    if (message.author.bot) return
    if (message.channel.type === "dm") return
    if (!message.content.startsWith(config.prefix)) return;
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g)
    const comando = args.shift().toLowerCase()
    const mentionUser = message.mentions.users.first()
    const memberMentions = message.guild.member(mentionUser)

    if (comando === "ping") {
        const m = await message.channel.send("ping ?")
        m.edit(`🏓 pong! A latência é  **${m.createdTimestamp - message.createdTimestamp}** ms. e a latência  da API  é **${Math.round(client.ping)}** ms.`)
    }

    if (comando === "") {
        message.channel.send(message.author + " Você esqueceu dos argumentos, Digite ``!dhelp`` para saber mais.")
    }

    if (comando === "avatar") {
        let numColor = Math.floor(Math.random() * (23234567 + 3 + 4))
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
let porta = process.env.PORT || 8080
console.log(porta)
client.login(config.token)