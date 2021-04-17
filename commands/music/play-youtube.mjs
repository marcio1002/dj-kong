import search from '../../modules/search_yt.mjs'
import permissionVoiceChannel from '../../modules/permissionVoiceChannel.mjs'
import helpers from '../../modules/helpers.mjs'
import { embedPlaylist, embedListOptions } from '../../modules/messageEmbed.mjs'
import {
  collectReactionNext,
  collectReactionPrev,
  collectReactionCancel,
  collectMessageOption,
  collectReactionConfirm,
  sendConnection
} from '../../modules/play.mjs'

let songs, searchTitle, songTitle = 'Para selecionar a música digite o número que está na frente do título.'

const command = {
  name: 'p',
  description: 'Toca músicas do youtube.',
  exemple: `\n**Como Usar:**\n\`\`\`${PREFIX}p Isaac gracie - hollow crown\n\n${PREFIX}p playlist URL\n\n${PREFIX}p video URL\`\`\``,
  execute(useProps) {
    let { args, embed, message: { channel, author } } = useProps[0]

    if (!permissionVoiceChannel(useProps)) return

    if (args.length == 0) return channel.send(embed.setDescription(`<@${author.id}>, digite \`${PREFIX}help ${command.name}\` para obter ajuda.`))

    useProps[0].collectionProps = { author, embed, songTitle, color: '#E62117', listOptions: command.listOptions, emojiPlayer: { prev: '\⬅️', next: '\➡️' } }
    searchTitle = args.join(' ')

    if (helpers.isYoutubeURL(args.join(' ')))
      command.ytUrl(useProps)
    else if (!(/(https|http):\/\/(.)+/.test(args.join(' '))))
      command.ytQuery(useProps)
  },

  async listOptions(p, n) {
    let option = p, optionsInfo

    optionsInfo = songs
      .slice(p, n)
      .map(video => `**${option += 1}** ➜ <:youtube:817569761881227315> **\`${video.title ?? video.name}\`** \n`)

    return optionsInfo.length !== 0 ? optionsInfo : `\`Não encontrei ${searchTitle}\``
  },

  async ytUrl(useProps) {
    const [messageProps, useMessageProps] = useProps, { collectionProps, args, embed, message: { channel, author } } = messageProps
    let video, playlist, options

    playlist = args.join(' ').match(/(playlist\?list=)\b(.)+/)
    video = args.join(' ').match(/(v=|youtu\.be\/)\b(.)+/)

    if (!video && !playlist) return channel.send(embed.setDescription(`<:error:773623679459262525> <@${author.id}> link inválido`))

    options = video ? { videoId: video[0].replace(video[1], '') } : { listId: playlist[0].replace(playlist[1], '') }

    collectionProps.msg = await channel.send('<a:load:771895739672428594>')

    search(options)
      .then(data => {
        if (!data || data.error) return channel.send(embed.setDescription(`<:error:773623679459262525> não encontrei nada relacionado a **\`${searchTitle}\`**.`))

        if (playlist) {

          collectionProps.songs = songs = data.videos.map(v => ({ url: `https://youtube.com/watch?v=${v.videoId}`, ...v }))
          collectionProps.songs.title = data.title
          collectionProps.songs.thumbnail = data.thumbnail
          collectionProps.type = 'playlist'

          command.listOptions(0, 10).then(async d => {
            collectionProps.msg.edit({
              content: '',
              embed: embedPlaylist({
                title: collectionProps.songs.title,
                thumbnail: collectionProps.songs.thumbnail,
                description: d,
                color: collectionProps.color
              })
            })

            await collectionProps.msg.react('<:check:825582630158204928>')
            if (collectionProps.songs?.length > 10) {
              collectionProps.emjPrev = await collectionProps.msg.react('\⬅️')
              collectionProps.emjNext = await collectionProps.msg.react('\➡️')
            }
            await collectionProps.msg.react('<:cancel:832394115609264158>')

            useMessageProps(messageProps)

            collectMessageOption(useProps)
            collectReactionNext(useProps)
            collectReactionPrev(useProps)
            collectReactionConfirm(useProps)
            collectReactionCancel(useProps)
          })

        } else {
          collectionProps.msg.delete()
          sendConnection(useProps, data)
        }
      })
      .catch(_ => collectionProps.msg.delete())
  },

  async ytQuery(useProps) {
    const [messageProps, useMessageProps] = useProps, { collectionProps, args, embed, message: { channel, author } } = messageProps

    collectionProps.msg = await channel.send('<a:load:771895739672428594>')

    search({ query: args.join(' ').toLowerCase(), limit: 20 })
      .then(data => {
        if (!data || data.error) return channel.send(embed.setDescription(`<:error:773623679459262525> não encontrei nada relacionado a **\`${searchTitle}\`**.`))

        collectionProps.songs = songs = data?.videos ?? []
        collectionProps.type = 'query'

        command.listOptions(0, 10).then(async d => {
          collectionProps.msg.edit({
            content: '',
            embed: embedListOptions(collectionProps.songTitle, '#E62117', d)
          })

          if (collectionProps.songs?.length > 10) {
            collectionProps.emjPrev = await collectionProps.msg.react('\⬅️')
            collectionProps.emjNext = await collectionProps.msg.react('\➡️')
          }
          await collectionProps.msg.react('<:cancel:832394115609264158>')

          useMessageProps(messageProps)

          collectMessageOption(useProps)
          collectReactionNext(useProps)
          collectReactionPrev(useProps)
          collectReactionCancel(useProps)
        })
      })
      .catch(_ => collectionProps.msg.delete())
  }
}

export default command