const discord = require("discord.js")
const client = new discord.Client()
const config = require("./config.json")
const pacotejson = require("./package.json")

client.on("ready", () => {
    console.log(`Bot foi iniciado, com ${client.users.size} usuários, ${client.channels.size} canais e ${client.guilds.size} servidores.`)
    client.user.setGame(`😍 Eu estou em ${client.guilds.size} servidores. um bom começo você não acha ? . 😃 `)
})

client.on("guildCreate", guild => {
    console.log(`O bot entrou  nos servidores: ${guild.name} (id ${guil.id}). população: ${guild.memberCount} membros.`)
    client.user.setActivity(`Estou em ${client.guilds.size} servidores`)
})

client.on("guildDelete", guild => {
    console.log(`O bot foi removido do servidor: ${guild.name} (id: ${guild.id})`)
    client.user.setActivity(`Servindo a ${client.guilds.size} servidores.`)
})

client.on("message", async message => {
    if (message.author.bot) return
    if (message.channel.type === "dm") return
    if (!message.content.startsWith(config.prefix)) return;
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g)
    const comando = args.shift().toLowerCase()

    if (comando === "ping") {
        const m = await message.channel.send("ping ?")
        m.edit(`🏓 pong! A latência é  **${m.createdTimestamp - message.createdTimestamp}** ms. A latência  da API  é **${Math.round(client.ping)}** ms.`)
    }
    if (comando === "") {
        const m = message.channel.send(" Você esqueceu de adicionar os argumentos. Digite **``!dhelp``** para saber mais.")
    }
   /* if (comando.t ==! "MESSAGE CREATE") {
        const m = message.channel.send(" 🤔 Não conheço esse comando. Digite **``!dhelp``** para saber mais.")
    }*/
})
client.on("raw", async dados =>{
    if (dados.t !== "MESSAGE_REACTION_ADD" && dados.t !== "MESSAGE_REACTION_REMOVE")return
    if (dados.d.message_id != "617843012617109515" && dados.d.channel_id != "617843012617109515")return

    let servidor = client.guilds.get("565566718446141450")
    let membro = servidor.members.get(dados.d.user_id)
    let cargo1 = servidor.roles.get("571713968834347065")
    let cargo2 = servidor.roles.get("571713974626680842")

    if (dados.t === "MESSAGE_REACTION_ADD"){
        if (dados.d.emoji.name == "🅰"){
            if(membro.roles.has(cargo1))return
            membro.addRole(cargo1)
        } else if (dados.d.emoji.name == "🇧"){
            if(membro.roles.has(cargo2))return
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
//client.on("raw", console.log)
client.login(config.token)