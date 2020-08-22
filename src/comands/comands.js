const ytdl = require('ytdl-core')
const yt = require("youtube-search")
const cmdImplemts = require("./func_imprements")
const config = require("../../config.json")
const key = (config.key) ? config.key : process.env.KEY
let songQueues = []
let songInfo = []
let song
let before = {}
let conn = null
let speaking = false
let dispatcher

const Comands = {

    avatar(messageProps) {
        const { embedSong, mentionUser, memberMentions, message: { channel, author } } = messageProps
        let avatar
        embedSong
            .setFooter(author.username, author.avatarURL())
            .setColor(cmdImplemts.colorRadomEx())

        if (mentionUser) {
            avatar = memberMentions.user.displayAvatarURL({ size: 1024, dynamic: true })

        } else {
            avatar = author.displayAvatarURL({ size: 1024, dynamic: true })
        }
        embedSong
            .setDescription(`<:image:633071783414726666>** [Baixar avatar](${avatar})**`)
            .setImage(avatar)

        channel.send(embedSong)
    },

    async server(messageProps) {
        const { embedSong, message: { channel, author, guild } } = messageProps
        let avatar = guild.splashURL() || guild.iconURL()
        let date = guild.createdAt.toLocaleDateString().split("-").reverse().join("-")
        embedSong
            .setFooter(author.username, author.avatarURL())
            .setColor(cmdImplemts.colorRadomEx())
            .setTitle(`${guild.name}`)
            .setDescription(`
                **Criador por:** <@${guild.ownerID}>\n
                **ID:** ${guild.id}\n
                **Sigla:** ${guild.nameAcronym}\n
                **Região:** ${guild.region}\n
                **Criado em:** ${date}\n
                **Total de canais:** ${guild.channels.cache.size} canais\n
                **Total de membros:** ${guild.memberCount} membros\n
                **Total de membros premiums:** ${guild.premiumSubscriptionCount} membros premiums\n
                **Servidor com muitos membros:** ${guild.large ? "sim" : "não"}\n
                **Servidor verificado** ${guild.verified ? "sim" : "não"}\n
                **Nível do prêmio do servidor:** ${guild.premiumTier}\n
            `)
            .setThumbnail(avatar)
        const m = await channel.send(embedSong)
        m.delete({ timeout: 55000 })
    },

    async help(messageProps) {
        const { embedHelp, message: { channel } } = messageProps

        embedHelp
            .setTitle("<:que:648555789119914005> **```Help```**")
            .setDescription("Adicione o **``Ondisco``** em outros servidores [Convite](https://discordapp.com/oauth2/authorize?=&client_id=617522102895116358&scope=bot&permissions=8) \n ----------------------------------------------------------")
            .addField("<:music:648556667364966400>", "**Comandos**", false)
            .addFields(
                { name: "``avatar``", value: "Visualizar e baixar o avatar do perfil", inline: true },
                { name: "``server``", value: "Descrição do servidor", inline: true },
                { name: "**``play``**", value: "inicia a música", inline: true },
                { name: "**``leave``**", value: "Finalizar a música e sai do canal", inline: true },
                { name: "**``back``**", value: "Continua a música pausada", inline: true },
                { name: "**``pause``**", value: "Pausa a música", inline: true },
                { name: "**``stop``**", value: "Finaliza a música", inline: true },
                { name: "**``vol``**", value: "Aumenta ou diminui o volume.\n **``Min:``** 0   **``Max:``** 4", inline: true },
                { name: "**``skip``**", value: "pula a música que está tocando no momento", inline: true },
                { name: "**``list``**", value: "Lista as músicas em espera", inline: true },
                { name: "**``OBS:``**", value: "Você pode cancelar nas opções de música digitando ``cancel``", inline: false },
            )

        const m = await channel.send(embedHelp)
        m.delete({ timeout: 35000 })
    },

    async search(content, optSearch = { maxResults: 10 }) {

        let option = 0
        let optionsInfo = []
        optSearch.key = key

        songQueues = await yt(content, optSearch)

        songQueues.results.forEach(video => {
            option += 1
            optionsInfo.push("** " + option + "** ➜ <:streamvideo:633071783393755167> **``" + video.title + "``** \n")
        })

        return optionsInfo.length ? optionsInfo : "**``Nenhum Resultado encontrado``**"
    },

    async play(messageProps) {
        const { voiceChannel, args, embedSong, message: { channel, author } } = messageProps

        if (!voiceChannel) return channel.send(`<:erro:630429351678312506> <@${author.id}> só posso tocar a música se você estiver conectado em um canal de voz`)
        if (voiceChannel.joinable === false || voiceChannel.speakable === false) return channel.send(`<:alert:630429039785410562> <@${author.id}> Não tenho permissão para ingressar ou enviar audio nesse canal.`)
        if (voiceChannel.muted) return channel.send(`<@${author.id}>  não posso enviar audio nesse canal de voz, canal de voz mudo.`)
        if (!voiceChannel.permissionsFor(author.id)) return
        const member = voiceChannel.permissionsFor(author.id)
        if (!member.has("CONNECT") || !member.has("ADMINISTRATOR")) return channel.send(`<@${author.id}> Você não tem permissão para conectar nesse canal de voz`)
        if (!args.length) return channel.send("<@" + author.id + "> Digite o nome da música que deseja tocar. \n exe: ``!dplay Russ - September 16`` ")

        let options = await this.search(args.join(" ").toLocaleLowerCase())

        embedSong
            .setTitle("Selecione a música que deseja tocar digitando um numero entre ``1`` a ``10``")
            .setDescription(options)

        const msg = await messageProps.message.reply(embedSong)

        msg.delete({ timeout: 80000 })

        const filter = res => res.author.id === author.id && !isNaN(Number(res.content)) || res.content == "cancel"

        msg.channel.awaitMessages(filter, { max: 1, time: 80000 })
            .then(async sellect => {
                if (sellect.first().content === "cancel") return channel.send("Música cancelada")

                song = songQueues.results[await cmdImplemts.selectOption(sellect.first().content)]
                if (!song) return

                voiceChannel.join().then(connection => (
                    conn = connection,
                    this.playMusic(messageProps)
                ))
                    .catch(err => channel.send("<:ata:648556666903724052> Esse disco está arranhado"))
            })
            .catch(err => channel.send("<:huuum:648550001298898944> \n Qual música será que ele escolheu!"))
    },

    leave(messageProps) {
        const { voiceChannel, embedSong, message: { channel, author } } = messageProps

        if (!voiceChannel || !conn) return

        embedSong.setTitle("Desconectado do canal ``" + voiceChannel.name + "``")

        conn.disconnect()

        channel.send(embedSong)
    },

    pause(messageProps) {
        const { voiceChannel, embedSong, message: { channel, author } } = messageProps

        if (!voiceChannel) return
        if (!conn) return channel.send(`<:erro:630429351678312506> <@${author.id}> Não estou conectado no canal de voz para conceder essa função`)

        if (speaking) {
            embedSong
                .setDescription("<:pause:633071783465058334> ")
                .setColor(cmdImplemts.colorRadomEx())
                .setFooter("")

            dispatcher.pause(true)
            channel.send(embedSong)
        } else {
            return channel.send(`<@${author.id}>  <:huuum:648550001298898944> nenhuma música tocando nesse canal!`)
        }
    },

    back(messageProps) {
        const { voiceChannel, embedSong, message: { channel } } = messageProps

        if (!voiceChannel || !conn) return

        if (dispatcher.paused) {
            dispatcher.resume()
            embedSong
                .setColor(cmdImplemts.colorRadomEx())
                .setDescription("<:play:633088252940648480> Back")
                .setFooter("")
            return channel.send(embedSong)
        }
    },

    stop(messageProps) {
        const { voiceChannel, embedSong, message: { channel, author } } = messageProps

        if (!voiceChannel || !conn) return

        if (speaking) {
            embedSong
                .setDescription("<:stop:648561120155795466> Stopped")
                .setFooter("")
            speaking = false
            dispatcher.destroy()
            channel.send(embedSong)
            before = songInfo.shift()
            songInfo.values().next().value
            if (songInfo.length > 0) this.finish([songInfo.values().next().value, { channel, embedSong }])
        } else {
            return channel.send(`<@${author.id}> <:huuum:648550001298898944> nenhuma música tocando nesse canal!`)
        }
    },

    vol(messageProps) {
        const { voiceChannel, args, embedSong, message: { channel, author } } = messageProps

        if (typeof args != "number" || !args) return
        if (!voiceChannel || !conn) return

        let numberVol = parseInt(args[0])
        let description

        switch (numberVol) {
            case 0:
                description = "<:silentmode:633076689202839612>"
                break
            case 1:
                description = "<:lowvolume:633076130626404388>"
                break
            case 3:
                description = "\🥴  Volume máximo, Não recomendo a altura desse volume"
                break
            default:
                conn.dispatcher.setVolume(0.5)
                break
        }
        channel.send(embedSong.setDescription(description))

        return (numberVol >= 0 && numberVol <= 3) ? dispatcher.setVolume(numberVol) : channel.send(`<:erro:630429351678312506> <@${author.id}> Digite um numero de 0 a 2`)
    },

    skip(messageProps) {
        const { voiceChannel } = messageProps
        if (!voiceChannel || !conn) return

        speaking = false
        dispatcher.destroy()
        before = songInfo.shift()
        songInfo.values().next().value
        if (songInfo.length > 0) this.finish([songInfo.values().next().value, { channel, embedSong }])
    },

    list(messageProps) {
        const { embedSong, message: { channel }, voiceChannel } = messageProps
        songQueues = []
        songInfo.forEach((obj, index) => {
            if (index != 0) songQueues.push("<:pastaMusic:630461639208075264> **``" + obj.title + "``** \n")
        })

        embedSong
            .setTitle("Lista de músicas na fila")
            .setDescription(songQueues.length ? songQueues : "**``Lista vazia``**")
        channel.send(embedSong)
    },

    async playMusic(messageProps) {
        const { embedSong, message: { channel }, voiceChannel } = messageProps

        if (!voiceChannel || !conn) return

        songInfo.push({
            title: song.title,
            image: song.thumbnails.medium,
            url: song.link,
        })

        if (speaking) {
            embedSong
                .setDescription("**Foi adicionado na fila:** \n **``" + song.title + "``** ")
                .setThumbnail(song.thumbnails.medium.url)
                .setTitle("")

            return channel.send(embedSong)
        }

        dispatcher = await conn.play(ytdl(songInfo[0].url), { volume: 0.5 })

        conn.on('error', err => (conn.disconnect(), console.error(err)))

        conn.on("disconnect", () => ( speaking = false, songInfo = [], conn = null ))

        dispatcher.on("error", err => conn.disconnect())

        dispatcher.on("start", () => this.sendMessage({ channel, embedSong }))

        dispatcher.on("finish", () => {
            if (voiceChannel.members.size <= 1 || !conn) return conn.disconnect()
            speaking = false
            before = songInfo.shift()
            songInfo.values().next().value
            if (songInfo.length > 0) this.finish([songInfo.values().next().value, { channel, embedSong,voiceChannel }])
        })
    },

    sendMessage(data) {
        const { channel, embedSong } = data
        speaking = true
        embedSong
            .setDescription(`[Link do vídeo](${songInfo[0].url})`)
            .setTitle("Tocando <a:Ondisco:630470764004638720> \n**``" + songInfo[0].title + "``**")
            .setThumbnail(songInfo[0].image.url)

        channel.send(embedSong)
    },

    async finish(data) {
        dispatcher = await conn.play(ytdl(data[0].url), { volume: 0.5 })

        conn.on('error', err => (conn.disconnect(), console.error(err)))

        conn.on("disconnect", () => ( speaking = false, songInfo = [], conn = null ))

        dispatcher.on("error", err => conn.disconnect())

        dispatcher.on("start", () => this.sendMessage(data[1]))

        dispatcher.on("finish", () => {
            [   ] = data[1]
            if (voiceChannel.members.size <= 1 || !conn) return conn.disconnect()
            speaking = false
            before = songInfo.shift()
            songInfo.values().next().value
            if (songInfo.length > 0) this.finish(songInfo.values().next().value)
        })
    }
}

module.exports = Comands