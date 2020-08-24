const ytdl = require('ytdl-core')
const yt = require("youtube-search")
const cmdImplemts = require("./func_imprements")
const config = require("../../config.json")
const yt_key = (config.yt_key) ? config.yt_key : process.env.YT_KEY
let songQueues = []
let songInfo = []
let song
let before
let conn = null
let speaking = false
let dispatcher

module.exports =  Commands = {

    findCommand(command, props) {
        if(!this[command] && typeof this[command] != "function")  return
        this[command](props)
    },

    avatar(messageProps) {
        const { embed, mentionUser, memberMentions, message: { channel, author } } = messageProps
        let avatar
        embed
            .setFooter(`${author.username} \t✦\t ${cmdImplemts.getDate()} ás ${cmdImplemts.getTimeStamp()}`,author.avatarURL())
            .setColor(cmdImplemts.colorRadomEx())

        if (mentionUser)
            avatar = memberMentions.user.displayAvatarURL({ size: 1024, dynamic: true })
        else 
            avatar = author.displayAvatarURL({ size: 1024, dynamic: true })
        
        embed
            .setDescription(`<:image:633071783414726666>** [Baixar avatar](${avatar})**`)
            .setImage(avatar)

        channel.send(embed)
    },

    async server(messageProps) {
        const { embed, message: { channel, author, guild } } = messageProps
        let avatar = guild.splashURL() || guild.iconURL()
        let date = guild.createdAt.toLocaleDateString().split("-").reverse().join("-")
        embed
            .setFooter(`${author.username} \t✦\t ${cmdImplemts.getDate()} ás ${cmdImplemts.getTimeStamp()}`,author.avatarURL())
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
            .setThumbnail(avatar);
            (await channel.send(embed)).delete({ timeout: 55000 })
    },

    async help(messageProps) {
        const { embed, message: { channel,author,createdAt } } = messageProps
       
        embed
            .setTitle("<:que:648555789119914005> **```Help```**")
            .setDescription("Adicione o **``Ondisco``** em outros servidores [Convite](https://discordapp.com/oauth2/authorize?=&client_id=617522102895116358&scope=bot&permissions=8)")
            .addField("<:music:648556667364966400> Comandos", "━━━━━━━━━━━━━━━━━━━━━", false)
            .addFields(
                { name: "``avatar``", value: "Visualizar e baixar o avatar do perfil", inline: true },
                { name: "``server``", value: "Descrição do servidor", inline: true },
                { name: "**``Comandos streaming``**", value: "━━━━━━━━━━━━━━━", inline: false },
                { name: "**``play``**", value: "inicia a música", inline: true },
                { name: "**``leave``**", value: "Finalizar a música e sai do canal", inline: true },
                { name: "**``pause``**", value: "Pausa a música", inline: true },
                { name: "**``unpause``**", value: "Continua a música pausada", inline: true },
                { name: "**``stop``**", value: "Finaliza a música", inline: true },
                { name: "**``vol``**", value: "Aumenta ou diminui o volume.\n **``Min:``** 0   **``Max:``** 3", inline: true },
                { name: "**``skip``**", value: "pula a música que está tocando no momento", inline: true },
                { name: "**``replay``**", value: "Toca a música anterior", inline: true },
                { name: "**``list``**", value: "Lista as músicas em espera", inline: true },
                { name: "**``OBS:``**", value: "Você pode cancelar na seleção de música digitando ``cancel``", inline: false },
            )
            .setFooter(`${author.username} \t✦\t ${cmdImplemts.getDate()} ás ${cmdImplemts.getTimeStamp()}`,author.avatarURL());

        (await channel.send(embed)).delete({ timeout: 55000 })
    },

    async search(content, optSearch = { maxResults: 10 }) {

        let option = 0, optionsInfo = []
        optSearch.key = yt_key

        songQueues = await yt(content, optSearch)

        songQueues.results.forEach(video => {
            option += 1
            optionsInfo.push("** " + option + "** ➜ <:streamvideo:633071783393755167> **``" + video.title + "``** \n")
        })

        return optionsInfo.length ? optionsInfo : "**``Nenhum Resultado encontrado``**"
    },

    async play(messageProps) {
        const { voiceChannel, args, embed, message: { channel, author } } = messageProps

        if (!voiceChannel) return channel.send(`<:erro:630429351678312506> <@${author.id}> só posso tocar a música se você estiver conectado em um canal de voz`)
        if (voiceChannel.joinable === false || voiceChannel.speakable === false) return channel.send(`<:alert:630429039785410562> <@${author.id}> Não tenho permissão para ingressar ou enviar audio nesse canal.`)
        if (voiceChannel.muted) return channel.send(`<@${author.id}>  não posso enviar audio nesse canal de voz, canal de voz mudo.`)
        if (!voiceChannel.permissionsFor(author.id)) return
        const member = voiceChannel.permissionsFor(author.id)
        if (!member.has("CONNECT") || !member.has("ADMINISTRATOR")) return channel.send(`<@${author.id}> Você não tem permissão para conectar nesse canal de voz`)
        if (args.length == 0) return channel.send("<@" + author.id + "> Digite o nome da música que deseja tocar. \n exe: ``!dplay Elmore - One Man Town`` ")

        let options = await this.search(args.join(" ").toLocaleLowerCase())

        embed
            .setTitle("Selecione a música que deseja tocar digitando um numero entre ``1`` a ``10``")
            .setDescription(options);

        let msg = await messageProps.message.reply(embed)

            msg.delete({ timeout: 80000 })
            msg.channel.awaitMessages(res => res.author.id === author.id && !isNaN(Number(res.content)) || res.content == "cancel", { max: 1, time: 80000 })
                .then(async select => {
                    if (select.first().content === "cancel") return channel.send("Música cancelada")

                    song = songQueues.results[await cmdImplemts.selectOption(select.first().content)]
                    if (!song) return

                    voiceChannel.join().then(connection => (
                        conn = connection,
                        this.playMusic(messageProps)
                    ))
                        .catch(err => channel.send("<:ata:648556666903724052> Esse disco está arranhado"))
                })
                .catch(err => channel.send("<:huuum:648550001298898944>  Qual música será que ele(a) escolheu!"))
    },

    leave(messageProps) {
        const { voiceChannel, embed, message: { channel, author } } = messageProps

        if (!voiceChannel || !conn) return

        embed.setTitle("Desconectado do canal ``" + voiceChannel.name + "``")

        conn.disconnect()

        channel.send(embed)
    },

    pause(messageProps) {
        const { voiceChannel, embed, message: { channel, author } } = messageProps

        if (!voiceChannel || !conn) return

        if (speaking) {
            embed
                .setDescription("<:pause:633071783465058334> ")
                .setColor(cmdImplemts.colorRadomEx())
                
            dispatcher.pause(true)
            channel.send(embed)
        } else {
            return channel.send(`<@${author.id}>  <:huuum:648550001298898944> nenhuma música tocando nesse canal!`)
        }
    },

    unpause(messageProps) {
        const { voiceChannel, embed, message: { channel } } = messageProps

        if (!voiceChannel || !conn) return

        if (dispatcher.paused) {
            dispatcher.resume()
            embed
                .setColor(cmdImplemts.colorRadomEx())
                .setDescription("<:play:633088252940648480> Back")
                ;
            channel.send(embed)
        }
    },

    stop(messageProps) {
        const { voiceChannel, embed, message: { channel, author } } = messageProps

        if (!voiceChannel || !conn) return

        if (speaking) {
            embed
                .setDescription("<:stop:648561120155795466> Stopped")
                
            speaking = false
            dispatcher.destroy()
            channel.send(embed)
            this.finish({ channel, embed, voiceChannel })
        } else {
            return channel.send(`<@${author.id}> <:huuum:648550001298898944> nenhuma música tocando nesse canal!`)
        }
    },

    vol(messageProps) {
        const { voiceChannel, args, embed, message: { channel, author } } = messageProps

        if (!voiceChannel || !conn || !args || isNaN(Number(args[0]))) return

        let numberVol = Number(args[0])
        let description

        switch (numberVol) {
            case numberVol<0||0:
                description = "<:silentmode:633076689202839612>"
                break
            case 1||2:
                description = "<:mediumvolume:633076130668085248>"
                break
            case 3:
                description = "\🥴  Volume máximo, Não recomendo a altura desse volume"
                break
            default:
                description = `<:erro:630429351678312506> <@${author.id}> Digite um numero de 0 a 3`
                conn.dispatcher.setVolume(0.5)
                break
        }
        channel.send(embed.setDescription(description))

        if(numberVol >= 0 && numberVol <= 3) dispatcher.setVolume(numberVol)
    },

    skip(messageProps) {
        const {message: {channel}, embed, voiceChannel } = messageProps
        if (!voiceChannel || !conn) return

        speaking = false
        dispatcher.destroy()
        this.finish({ channel, embed ,voiceChannel})
    },

    async replay(messageProps) {
        const {message: { channel }, embed, voiceChannel } = messageProps

        if (!voiceChannel || !conn || !before) return

        conn.on('error', err => (conn.disconnect(), console.error(err)))
            .on("disconnect", () => ( speaking = false, songInfo = [], conn = null ))

        dispatcher = await conn.play(ytdl(before.url), { volume: 0.5 })
        .on("error", err => conn.disconnect())
        .on("start", () => {
            speaking = true 
            embed
                .setDescription(`[Link do vídeo](${before.url})`)
                .setTitle("Tocando <a:Ondisco:630470764004638720> \n**``" + before.title + "``**")
                .setThumbnail(before.image.url)

            channel.send(embed)
        })
        .on("finish", () => {
            if (voiceChannel.members.size <= 1 || !conn) return conn.disconnect()
            this.finish({ channel, embed, voiceChannel })
        })
    },

    list(messageProps) {
        const { embed, message: { channel }} = messageProps
        songQueues = []
        songInfo.forEach((obj, index) => index != 0 && songQueues.push("<:pastaMusic:630461639208075264> **``" + obj.title + "``** \n"))

        embed
            .setTitle("Lista de músicas na fila")
            .setDescription(songQueues.length ? songQueues : "**``Lista vazia``**")
        channel.send(embed)
    },

    async playMusic(messageProps) {
        const { embed, message: { channel }, voiceChannel } = messageProps

        if (!voiceChannel || !conn) return

        songInfo.push({
            title: song.title,
            image: song.thumbnails.medium,
            url: song.link,
        })

        if (speaking) {
            embed
                .setDescription("**Foi adicionado na fila:** \n **``" + song.title + "``** ")
                .setThumbnail(song.thumbnails.medium.url)
                .setTitle("")

            return channel.send(embed)
        }


        conn.on('error', err => (conn.disconnect(), console.error(err)))
            .on("disconnect", () => ( speaking = false, songInfo = [], conn = null ))

        dispatcher = await conn.play(ytdl(songInfo[0].url), { volume: 0.5 })
            .on("error", err => conn.disconnect())
            .on("start", () => this.sendMessage({ channel, embed }))
            .on("finish", () => {
                if (voiceChannel.members.size <= 1 || !conn) return conn.disconnect()
                this.finish({ channel, embed,voiceChannel })
            })
    },

    sendMessage(data) {
        const { channel, embed } = data
        speaking = true
        embed
            .setDescription(`[Link do vídeo](${songInfo[0].url})`)
            .setTitle("Tocando <a:Ondisco:630470764004638720> \n**``" + songInfo[0].title + "``**")
            .setThumbnail(songInfo[0].image.url)

        channel.send(embed)
    },

    async finish(data) {
        speaking = false
        before = songInfo.shift()
        if (songInfo.length == 0) return
        
        conn.on('error', err => (conn.disconnect(), console.error(err)))
            .on("disconnect", () => ( speaking = false, songInfo = [], conn = null ))

        dispatcher = await conn.play(ytdl(songInfo[0].url), { volume: 0.5 })
            .on("error", err => conn.disconnect())
            .on("start", () => this.sendMessage(data))
            .on("finish", () => {
                if (data.voiceChannel.members.size <= 1 || !conn) return conn.disconnect()
                this.finish(data)
            })
    }
}