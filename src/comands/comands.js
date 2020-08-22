const ytdl = require('ytdl-core')
const yt = require("youtube-search")
const cmdImplemts = require("./func_imprements")
const evtsMusic = require("./eventsMusic")
const config = require("../../config.json")
const key = (config.key) ? config.key : process.env.KEY
const evt = new evtsMusic
let listVideos = []
let song
let conn = null
var speaking = false
var dispatcher
var songInfo = []
var title = ""
var url = ""
var image = ""

const Comands = {

    avatar(messageProps)  {
        const { embedSong, mentionUser, memberMentions, message: { channel, author } } = messageProps
        let avatar
        let image
        embedSong
            .setFooter(author.username, author.avatarURL())
            .setColor(cmdImplemts.colorRadomEx())

        if (mentionUser) {
            avatar = memberMentions.user.displayAvatarURL()
            image = memberMentions.user.displayAvatarURL()

        } else {
            avatar = author.displayAvatarURL()
            image = author.displayAvatarURL()
        }
        embedSong
            .setDescription(`<:image:633071783414726666>** [Download do avatar](${avatar})**`)
            .setImage(image)

        channel.send(embedSong)
    },

    async help(messageProps) {
        const { embedHelp, message: { channel } } = messageProps

        embedHelp
            .setTitle("<:que:648555789119914005> **```Help```**")
            .setDescription("Adicione o **``Ondisco``** em outros servidores [Convite](https://discordapp.com/oauth2/authorize?=&client_id=617522102895116358&scope=bot&permissions=8) \n ----------------------------------------------------------")
            .addField("<:music:648556667364966400>", "**Comandos**", false)
            .addFields(
                { name: "``avatar``", value: "Comando para visualizar o avatar do perfil", inline: true },
                { name: "**``play``**", value: "inicia a música", inline: true },
                { name: "**``leave``**", value: "Finalizar a música e sai do canal", inline: true },
                { name: "**``back``**", value: "Continua a música pausada", inline: true },
                { name: "**``pause``**", value: "Pausa a música", inline: true },
                { name: "**``stop``**", value: "Finaliza a música", inline: true },
                { name: "**``vol``**", value: "Aumenta ou diminui o volume.\n **``Min:``** 0   **``Max:``** 4", inline: true },
                { name: "**``skip``**", value: "pula a música que está tocando no momento", inline: true },
                { name: "**``OBS:``**", value: "Você pode cancelar nas opções de música digitando ``cancel``", inline: false },
            )

        const m = await channel.send(embedHelp)
        m.delete({ timeout: 35000 })
    },

    async search (content,optSearch = { maxResults: 10} ) {

        let option = 1
        let optionsInfo = []
        optSearch.key = key

        listVideos =  await yt(content,optSearch)

        for (const video of listVideos.results) {
            optionsInfo.push("** " + option + "** ->  <:streamvideo:633071783393755167> **``" + video.title + "``** \n")
            option += 1
        }

        return optionsInfo.length ? optionsInfo : "**``Nenhum Resultado encontrado``**"
    },

    delete(messageProps){
        const {args,  message: { channel } } = messageProps
        if(isNaN(Number(args))) return 
        channel.bulkDelete(args)
    },

    async  play(messageProps) {
        const { voiceChannel, args, embedSong, message: { channel, author } } = messageProps

        if (!voiceChannel) return channel.send(`<:erro:630429351678312506> <@${author.id}> só posso tocar a música se você estiver conectado em um canal de voz`)
        if (voiceChannel.joinable === false || voiceChannel.speakable === false) return channel.send(`<:alert:630429039785410562> <@${author.id}> Não tenho permissão para ingressar ou enviar audio nesse canal.`)
        if (voiceChannel.muted) return channel.send(`<@${author.id}>  não posso enviar audio nesse canal de voz, canal de voz mudo.`)
        if (!voiceChannel.permissionsFor(author.id)) return
        const member = voiceChannel.permissionsFor(author.id)
        if (!member.has("CONNECT") || !member.has("ADMINISTRATOR")) return channel.send(`<@${author.id}> Você não tem permissão para conectar nesse canal de voz`)
        if (!args.length) return channel.send("<@" + author.id + "> Digite o nome da música que deseja tocar. \n exe: ``!dplay Russ - September 16`` ")

        let options = await Comands.search(args.join(" ").toLocaleLowerCase())

        embedSong
            .setTitle("Selecione a música que deseja tocar digitando um numero entre ``1`` a ``10``")
            .setDescription(options)

        const msg = await messageProps.message.reply(embedSong)

        msg.delete({ timeout: 80000 })

        const filter = res => res.author.id === author.id

        msg.channel.awaitMessages(filter, { max: 1, time: 80000 })
            .then(async sellect => {
                if (sellect.first().content === "cancel") return channel.send("Música cancelada")

                let op = await cmdImplemts.selectOption(sellect.first().content)
                song = listVideos[op]
                if (!song) return

                voiceChannel.join().then(connection => (
                    conn = connection,
                    Comands.playMusic(messageProps)
                ))
                .catch(err => console.warn(err))
            })
            .catch(err => console.warn(err))
    },

    leave(messageProps)  {
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
                .setDescription("<:pause:633071783465058334> Paused")
                .setColor(cmdImplemts.colorRadomEx())

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
            return channel.send(embedSong)
        }
    },

    stop(messageProps) {
        const { voiceChannel, embedSong, message: { channel, author } } = messageProps

        if (!voiceChannel) return
        if (!conn) return channel.send(`<:erro:630429351678312506> <@${author.id}> Não estou conectado no canal de voz para conceder essa função`)

        if (speaking) {
            embedSong.setDescription("<:stop:648561120155795466> Stopped")

            dispatcher.destroy()
            speaking = false
            channel.send(embedSong)
            dispatcher.emit("finish")
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

    async skip (messageProps) {
        const {embedSong, message: {channel}, voiceChannel } = messageProps
        if (!voiceChannel || !conn) return

        evt.emit("finished")
        evt.emit("start", { channel ,embedSong})
    },

    async playMusic (messageProps) {
        const { embedSong, message: { channel }, voiceChannel } = messageProps

        if (!voiceChannel || !conn) return

        if (speaking) {
            songInfo.push({
                title: song.title,
                image: song.thumbnails,
                url: `https://www.youtube.com/watch?v=${song.id}`,
                timeStamp: song.duration
            })

            embedSong
                .setDescription("**Foi adicionado na fila:** \n **``"+ song.title+ "``** ")
                .setThumbnail(song.thumbnail.medium)
                .setTitle("")

            channel.send(embedSong)

        } else {
            Comands.events()

            songInfo.push({
                title: song.title,
                image: song.thumbnail,
                url: `https://www.youtube.com/watch?v=${song.id}`,
                timeStamp: song.duration
            })

            title = songInfo[0].title
            timeStamp = songInfo[0].timeStamp
            url = songInfo[0].url
            image = songInfo[0].image

            dispatcher = await conn.play(ytdl(url), { volume: 0.5 })

            conn.on('error', err => (conn.disconnect(), console.error(err)))

            conn.on("disconnect", () => (
                speaking = false,
                songInfo = [],
                conn = null
            ))

            dispatcher.on("error", err => conn.disconnect())

            dispatcher.on("start", () => evt.emit("start", { channel ,embedSong}))

            dispatcher.on("finish", () => {
                if (voiceChannel.members.size <= 1) return conn.disconnect()
                if (!conn) return
                if (songInfo.length >= 10) songInfo.shift()
                evt.emit("finished")
            })
        }
    },

    events()  {
        evt.on("start", data => {
            const { channel, embedSong } = data
            speaking = true

            embedSong
                .setDescription(`[Link do vídeo](${url})`)
                .setTitle("Tocando <a:Ondisco:630470764004638720> \n**``" + title + "``**")
                .setThumbnail(image)

            channel.send(embedSong)
        })


        evt.on("finished", () => {
            const songs = songInfo.values().next()
            speaking = false

            if (!songs.done) {
                let song = songs.value
                title = song.title
                timeStamp = song.timeStamp
                url = song.url
                image = song.image
                conn.play(ytdl(song.url, { volume: 0.5 }))
            } else {
                return
            }
        })
    }
}

module.exports = Comands