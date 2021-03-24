import search from '../../modules/search_yt.mjs'
import { spTracks } from '../../modules/search_spy.mjs'
import { reproduce } from '../../modules/songState.mjs'
import permissionVoiceChannel from '../../modules/permissionVoiceChannel.mjs'
import helpers from '../../modules/helpers.mjs'
const prefix = process.env.PREFIX

let result, emjNext, emjPrev, next = 10, prev = 0

const command = {
  name: 'p',
  description: 'Reproduz a música ou adiciona na fila.',
  execute(useProps) {
    let { args, embed, message: { channel, author } } = useProps[0]

    if (!permissionVoiceChannel(useProps)) return

    if (args.length == 0) return channel.send(
      embed.setDescription(`<@${author.id}>, digite o título da música ou a url.\n\n**Exemplos**:\n\n**Spotify**\n**\`${prefix}${this.name} spotify soja - prison blues\`**\n**\`${prefix}${this.name} URL\`**\n\n**Youtube**\n**\`${prefix}${this.name} youtube Isaac gracie - hollow crown\`**\n**\`${prefix}${this.name} Isaac gracie - hollow crown\`**\n**\`${prefix}${this.name} URL\`**`)
    )

    if (/(https|http):\/\/(www\.)?(.)+/.test(args.join(' '))) {
      if (/(v=|youtu\.be\/)\b(.)+/.test(args.join(' ')))
        this.ytUrl(useProps)
      else if (/track\/\b(.)+(?=si=(.)+)?/)
        this.spyUrl(useProps)
    } else {
      if (args[0] == 'youtube' || args[0] != 'youtube' && args[0] != 'spotify') {
        if (/(youtube)/i.test(args.join(' '))) args.shift()
        this.ytQuery(useProps)
      } else if (args[0] == 'spotify') {
        if (/(spotify)/i.test(args.join(' '))) args.shift()
        this.spyQuery(useProps)
      }
    }
  },

  sendConnection(useProps) {
    const [messageProps, setMessageProps] = useProps
    const { voiceChannel } = messageProps

    if (!messageProps.conn)
      voiceChannel
        .join()
        .then(connection => {
          messageProps.conn = connection
          setMessageProps(messageProps)
          reproduce(useProps)
        })
        .catch(_ => console.warn('Erro ao conectar no canal de voz'))
    else {
      setMessageProps(messageProps)
      reproduce(useProps)
    }
  },

  collectReactionPrev({ msg, author, embed, icon }) {
    const filterEmjPrev = (reaction, user) => reaction.emoji.name == '\⬅️' && user.id == author.id

    msg
      .createReactionCollector(filterEmjPrev, { time: 80000 })
      .on('collect', async r => {

        emjPrev.remove()
        msg.react('\➡️').then(d => { emjNext = d })

        embed
          .setColor('#E62117')
          .setTitle('Selecione a música para reproduzir no canal voz digitando um numero entre ``1`` a ``10``')
          .setDescription(await this.listOptions(prev -= 10, next -= 10, icon));

        msg.edit({ content: '', embed })
      })
  },

  collectReactionNext({ msg, author, embed, icon }) {
    const filterEmjNext = (reaction, user) => reaction.emoji.name == '\➡️' && user.id == author.id

    msg
      .createReactionCollector(filterEmjNext, { time: 80000 })
      .on('collect', async r => {

        emjNext.remove();
        msg.react('\⬅️').then(d => { emjPrev = d })

        embed
          .setColor('#E62117')
          .setTitle('Selecione a música para reproduzir no canal voz digitando um numero entre ``1`` a ``10``')
          .setDescription(await this.listOptions(prev = next, next += 10, icon));

        msg.edit({ content: '', embed })
      })
  },

  async listOptions(pageStart, pageEnd, icon) {
    let option = pageStart, optionsInfo

    optionsInfo = result
      .slice(pageStart, pageEnd)
      .map(video => `**${option += 1}** ➜ ${icon} **\`${video.title ?? video.name}\`** \n`)

    return optionsInfo.length !== 0 ? optionsInfo : '`Nenhum resultado`'
  },

  async ytUrl(useProps) {
    const [messageProps,] = useProps
    const { args, embed, songs, message: { channel, author } } = messageProps
    let msg, match

    match = args.join(' ').match(/(v=|youtu\.be\/)\b(.)+/)

    if (!match) return channel.send(embed.setDescription(`<:error:773623679459262525> <@${author.id}> link inválido`))

    msg = await channel.send('<a:load:771895739672428594>')

    search({
      options: { videoId: match[0].replace(match[1], '') },
      success: data => {
        msg.delete()

        if (data.error) return channel.send(embed.setDescription('<:error:773623679459262525> não foi possível reproduzir essa música.'))

        songs.set('queues', [...songs.get('queues'), data])

        this.sendConnection(useProps)
      },
      error: console.error
    })
  },

  async ytQuery(useProps) {
    const [messageProps,] = useProps
    const { args, embed, songs, message: { channel, author } } = messageProps

    let msg, song

    if (args.length == 0) return channel.send(
      embed.setDescription(`<@${author.id}>, digite o título da música ou a url.\n\n**Exemplos**:\n\n**Spotify**\n**\`${prefix}${this.name} spotify soja - prison blues\`**\n**\`${prefix}${this.name} URL\`**\n\n**Youtube**\n**\`${prefix}${this.name} youtube Isaac gracie - hollow crown\`**\n**\`${prefix}${this.name} Isaac gracie - hollow crown\`**\n**\`${prefix}${this.name} URL\`**`)
    )

    msg = await channel.send('<a:load:771895739672428594>')

    search({
      options: { query: args.join(' ').toLowerCase(), limit: 20 },
      success: async data => {
        if (data.error) return channel.send(embed.setDescription('<:error:773623679459262525> não foi possível reproduzir essa música.'))
        
        result = data?.videos ?? []

        embed
          .setColor('#E62117')
          .setTitle('Selecione a música para reproduzir no canal voz.\nVocê pode cancelar digitando `cancel`.\n')
          .setDescription(await this.listOptions(prev = 0, next = 10, '<:youtube:817569761881227315>'))

        msg.edit({ content: '', embed })

        emjNext = await msg.react('\➡️')

        this.collectReactionNext({ msg, author, embed, icon: '<:youtube:817569761881227315>' })
        this.collectReactionPrev({ msg, author, embed, icon: '<:youtube:817569761881227315>' })

        const filter = m => m.author.id === author.id && !isNaN(Number(m.content)) || m.content.toLowerCase() == 'cancel'

        msg.channel
          .createMessageCollector(filter, { max: 1, maxUsers: 1, time: 100000 })
          .on('collect', select => {
            msg.delete()

            if (select.content.toLowerCase() === 'cancel') return channel.send('Cancelado')
            if (!(song = result[Number(select.content) - 1])) return

            result = null

            songs.set('queues', [...songs.get('queues'), song])

            this.sendConnection(useProps)
          })
      },
      error: console.error
    })
  },

  async spyUrl(useProps) {
    const [messageProps,] = useProps
    const { args, embed, songs, message: { channel, author } } = messageProps
    let msg, match

    match = args.join(' ').match(/track\/\b(.)+(?=si=(.)+)?/)

    if (!match) return channel.send(embed.setDescription(`<:error:773623679459262525> <@${author.id}> link inválido`))

    msg = await channel.send('<a:load:771895739672428594>')

    spTracks({
      urlId: match[0].replace('track\/', ''),
      success: ({ data }) => {
        msg.delete()

        if (data.error) return channel.send(embed.setDescription('<:error:773623679459262525> não foi possível reproduzir essa música.'))

        songs.set('queues', [...songs.get('queues'), {
          url: data.external_urls.spotify,
          title: data.name,
          timestamp: helpers.songTimeStamp(data.duration_ms),
          album: data.album
        }])

        this.sendConnection(useProps)
      },
      error: console.error
    })
  },

  async spyQuery(useProps) {
    const [messageProps,] = useProps
    const { args, embed, songs, message: { channel, author } } = messageProps

    let msg, song

    if (args.length == 0) return channel.send(
      embed.setDescription(`<@${author.id}>, digite o título da música ou a url.\n\n**Exemplos**:\n\n**Spotify**\n**\`${prefix}${this.name} spotify soja - prison blues\`**\n**\`${prefix}${this.name} URL\`**\n\n**Youtube**\n**\`${prefix}${this.name} youtube Isaac gracie - hollow crown\`**\n**\`${prefix}${this.name} Isaac gracie - hollow crown\`**\n**\`${prefix}${this.name} URL\`**`)
    )

    msg = await channel.send('<a:load:771895739672428594>')

    spTracks({
      query: args.join(' ').toLowerCase(),
      success: async ({ data }) => {
        if (data.error) return channel.send(embed.setDescription('<:error:773623679459262525> não foi possível reproduzir essa música.'))

        result = data?.items ?? []

        embed
          .setColor('#E62117')
          .setTitle('Selecione a música para reproduzir no canal voz.\nVocê pode cancelar digitando `cancel`.\n')
          .setDescription(await this.listOptions(prev = 0, next = 10, '<:spotify:817569762178629693>'))

        msg.edit({ content: '', embed })

        emjNext = await msg.react('\➡️')

        this.collectReactionNext({ msg, author, embed, icon: '<:spotify:817569762178629693>' })
        this.collectReactionPrev({ msg, author, embed, icon: '<:spotify:817569762178629693>' })

        const filter = m => m.author.id === author.id && !isNaN(Number(m.content)) || m.content.toLowerCase() == 'cancel'

        msg.channel
          .createMessageCollector(filter, { max: 1, maxUsers: 1, time: 100000 })
          .on('collect', select => {
            msg.delete()

            if (select.content.toLowerCase() === 'cancel') return channel.send('Cancelado')
            if (!(song = result[Number(select.content) - 1])) return

            result = null

            songs.set('queues', [...songs.get('queues'), {
              url: song.external_urls.spotify,
              title: song.name,
              timestamp: helpers.songTimeStamp(song.duration_ms),
              album: song.album
            }])

            this.sendConnection(useProps)
          })
      },
      error: console.error
    })
  },
}

export default command