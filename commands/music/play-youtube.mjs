import { ytVideo, ytPlaylist } from '../../utils/search_yt.mjs'
import permissionVoiceChannel from '../../utils/permissionVoiceChannel.mjs'
import helpers from '../../utils/helpers.mjs'
import { embedPlaylist, embedListOptions } from '../../utils/messageEmbed.mjs'
import {
  collectReactionNext,
  collectReactionPrev,
  collectReactionCancel,
  collectMessageOption,
  collectReactionConfirm,
  sendConnection
} from '../../utils/play.mjs'

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
      .map(video => `**${option += 1}** ➜ <:youtube:817569761881227315> **\`${video.title}\`** \n`)

    return optionsInfo.length !== 0 ? optionsInfo : `\`Nenhum resultado relacionado a "${searchTitle}"\` `
  },

  async ytUrl(useProps) {
    const [messageProps, useMessageProps] = useProps, { collectionProps, args, embed, message: { channel, author } } = messageProps
    let url, videoId, listId, search

    
    url = new URL(args.join(' '))

    listId = args.join(' ').match(/(youtube\.com)\/playlist?(.)+/) ? url.searchParams.get('list') : null
    videoId = url.searchParams.get('v') ??  (
     (videoId = url.href.match(/(youtu\.be\/)(.)+/)) ? videoId[0].replace('youtu\.be\/','') : null
    )

    if (!videoId && !listId) return channel.send(embed.setDescription(`<:error:773623679459262525>  link inválido`))

    collectionProps.msg = await channel.send('<a:load:771895739672428594>')

    search = videoId ? ytVideo({ videoId }) : ytPlaylist({ listId })

    search
      .then(data => {
        if (!data) return channel.send(embed.setDescription(`**<:alert:773623678830903387> não encontrei nenhum(a) playlist/vídeo.**`))

        if (listId) {
          data = helpers.formatYtPlayList(data)
          
          collectionProps.songs = songs = data.videos.map(helpers.formatYtQuery)
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
          data = helpers.formatYtQuery(data)
          collectionProps.msg.delete()
          sendConnection(useProps, data)
        }
      })
      .catch(_ => console.log(_) && collectionProps.msg.delete())
  },

  async ytQuery(useProps) {
    const [messageProps, useMessageProps] = useProps, { collectionProps, args, embed, message: { channel, author } } = messageProps

    collectionProps.msg = await channel.send('<a:load:771895739672428594>')

    ytVideo({ video: args.join(' ').toLowerCase(), options: { pageStart: 0, pageEnd: 25 } })
      .then(data => {
        if (!data) return channel.send(embed.setDescription(`<:alert:773623678830903387> nenhum resultado relacionado a **\`${searchTitle}\`**.`))

        collectionProps.songs = songs = data.map(helpers.formatYtQuery)
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