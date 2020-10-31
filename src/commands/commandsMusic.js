const ytdl=require("ytdl-core"),yt=require("youtube-search"),cmdImplemts=require("./func_imprements"),yt_key=require("../../config.json").yt_key?require("../../config.json").yt_key:process.env.YT_KEY;
let song,before,dispatcher,songQueues=[],songInfo=[],conn=null,speaking=!1,alert=0;


module.exports = {

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
    const { voiceChannel, args, embed, bot, message: { channel, author } } = messageProps
    let botPermission = null
    if (!voiceChannel) return channel.send(`<:erro:630429351678312506> <@${author.id}> só posso tocar a música se você estiver conectado em um canal de voz`)
    if (!(botPermission = voiceChannel.permissionsFor(bot.user.id).serialize())) return
    if (!botPermission["CONNECT"]) return channel.send(`<:erro:630429351678312506> <@${author.id}> Não tenho permissão para conectar nesse canal de voz`)
    if (!botPermission["SPEAK"] || !voiceChannel.speakable) return channel.send(`<:erro:630429351678312506> <@${author.id}> Não tenho permissão para falar nesse canale de voz`)
    if (!botPermission["USE_VAD"] && alert <= 1) {
      alert += 1
      channel.send("<:alert:630429039785410562>  ``Estou sem permissão para usar detecção de voz isso pode afetar minha transmissão``")
    }
    if (voiceChannel.muted) return channel.send(`<@${author.id}>  não posso enviar audio nesse canal de voz, canal de voz mudo.`)
    if (args.length == 0) return channel.send("<@" + author.id + "> Digite o nome da música que deseja tocar. \n exe: ``!dplay Elmore - One Man Town`` ")

    let msg = await channel.send("<a:load:771895739672428594>")
    let optionsInfo = await this.search(args.join(" ").toLocaleLowerCase())

    embed
      .setTitle("Selecione a música que deseja tocar digitando um numero entre ``1`` a ``10``")
      .setDescription(optionsInfo);

    msg.edit({content: "", embed: embed})
    msg.delete({ timeout: 80000 })

    const filter = msg => msg.author.id === author.id && !isNaN(Number(msg.content)) || msg.content == "cancel"
    msg.channel.awaitMessages(filter, { max: 1, time: 80000 })
      .then(async select => {
      if (select.first().content === "cancel") return channel.send("Seleção cancelada")

      song = songQueues.results[await cmdImplemts.selectOption(select.first().content)]
      if (!song) return

      voiceChannel.join().then(connection => (
        conn = connection,
        this.reproduce(messageProps)
      ))
        .catch(err => console.warn("\033[1;33mErro ao conectar no canal de voz"))
    })
      .catch(err => channel.send("Está com dúvidas pra escolher uma música"))
  },

  leave( { voiceChannel, embed, message: { channel } }) {

    if (!voiceChannel || !conn) return

    embed.setTitle("Desconectado do canal ``" + voiceChannel.name + "``")

    conn.disconnect()

    channel.send(embed)
  },

  pause({ voiceChannel, embed, message: { channel, author } }) {

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

  unpause({ voiceChannel, embed, message: { channel } }) {

    if (!voiceChannel || !conn) return

    if (dispatcher.paused) {
      dispatcher.resume()
      embed
        .setColor(cmdImplemts.colorRadomEx())
        .setDescription("<:play:633088252940648480> Back");
      channel.send(embed)
    }
  },

  stop({voiceChannel, embed, message: { channel, author } }) {
    if (!voiceChannel || !conn) return

    if (speaking) {
      embed
        .setDescription("<:stop:648561120155795466> Stopped")

      dispatcher.destroy()
      channel.send(embed)
      this.finish(messageProps)
    } else {
      return channel.send(`<@${author.id}> <:huuum:648550001298898944> nenhuma música tocando nesse canal!`)
    }
  },

  vol({ voiceChannel, args, embed, message: { channel, author } }) {

    if (!voiceChannel || !conn || !args || isNaN(Number(args[0]))) return

    let numberVol = Number(args[0])
    let description

    if (numberVol < 0 || numberVol > 3) return channel.send(embed.setDescription(`<:erro:630429351678312506> <@${author.id}> Digite um numero de 0 a 3`))

    switch (numberVol) {
      case 0:
        description = "<:silentmode:633076689202839612>"
        break
      case 1:
        description = "<:lowvolume:633076130626404388>"
        break;
      case 2:
        description = "<:autovolume:633076130668085248>"
        break
      case 3:
        description = "\🥴  Volume máximo, Não recomendo a altura desse volume"
        break
    }

    dispatcher.setVolume(numberVol)
    channel.send(embed.setDescription(description))
  },

  skip(messageProps) {
    const { voiceChannel } = messageProps
    if (!voiceChannel || !conn) return

    dispatcher.destroy()
    this.finish(messageProps)
  },

  async replay(messageProps) {
    const { message: { channel }, embed, voiceChannel } = messageProps

    if (!voiceChannel || !conn || !before) return

    conn
      .on('error', err => (conn.disconnect(), console.error(err)))
      .on("disconnect", () => (speaking = false, songInfo = [], conn = null))

    dispatcher = await conn.play(ytdl(before.url,{filter: "audioandvideo"} ), { volume: 0.5 })
      .on("error", err => conn.disconnect())
      .on("start", () => this.sendMessage(messageProps,before))
      .on("finish", () => {
        if (voiceChannel.members.size <= 1 || !conn) return conn.disconnect()
        this.finish(messageProps)
      })
  },

  async reproduce(messageProps) {
    const { embed, message: { channel }, voiceChannel } = messageProps

    if (!voiceChannel || !conn) return

    if (song)
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

    conn
      .on('error', err => (console.warn( "\033[1;31m" + err),conn.disconnect()))
      .on("disconnect", () => (speaking = false, songInfo = [], conn = null, song = null))

    dispatcher = await conn.play(ytdl(songInfo[0].url,{filter: "audioandvideo"}), { volume: 0.5 })
      .on("error", err => (console.warn( "\033[1;31m" + err),conn.disconnect()))
      .on("start", () => this.sendMessage(messageProps,songInfo[0]))
      .on("finish", () => this.finish(messageProps))
  },

  list({ embed, message: { channel } }) {
    songQueues = []
    songInfo.forEach((song, index) => index != 0 && songQueues.push("<:pastaMusic:630461639208075264> **``" + song.title + "``** \n"))

    embed
      .setTitle("Lista de músicas na fila")
      .setDescription(songQueues.length ? songQueues : "**``Lista vazia``**")
    channel.send(embed)
  },

  sendMessage({ embed, message: { channel } },songMessage) {
    speaking = true
    embed
      .setDescription(`[Link do vídeo](${songMessage.url})`)
      .setTitle("Tocando <a:song:771822822128353320> \n\n**``" + songMessage.title + "``**")
      .setThumbnail(songMessage.image.url)

    channel.send(embed)
  },

  finish(messageProps) {
    const { voiceChannel } = messageProps

    if (voiceChannel.members.size <= 1 || !conn) return conn.disconnect()
    
    speaking = false
    song = null
    before = songInfo[0]
    songInfo.shift()
    if (songInfo.length == 0) return

    this.reproduce(messageProps)
  },
}