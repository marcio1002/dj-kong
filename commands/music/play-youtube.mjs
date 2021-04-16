import search from '../../modules/search_yt.mjs'
import permissionVoiceChannel from '../../modules/permissionVoiceChannel.mjs'
import helpers from '../../modules/helpers.mjs'
import { embedPlaylist, embedListOptions } from '../../modules/messageEmbed.mjs'
import { 
  collectReactionNext, 
  collectReactionPrev, 
  collectReactionCancel,
  collectMessageOption, 
  sendConnection
} from '../../modules/play.mjs'

let songs

const command = {
  name: 'p',
  description: 'Toca músicas do youtube.',
  exemple: `\n**Como Usar:**\n\`\`\`${PREFIX}p Isaac gracie - hollow crown\n\n${PREFIX}p playlist URL\n\n${PREFIX}p video URL\`\`\``,
  execute(useProps) {
    let { args, embed, message: { channel, author } } = useProps[0]

    if (!permissionVoiceChannel(useProps)) return

    if (args.length == 0) return channel.send(embed.setDescription(`<@${author.id}>, digite \`${PREFIX}help ${command.name}\` para obter ajuda.`))

    useProps[0].collectionProps = { author, embed, color: '#E62117', listOptions: command.listOptions, emojiPlayer: { prev: '\⬅️', next: '\➡️' } }


    if (helpers.isYoutubeURL(args.join(' ')))
      command.ytUrl(useProps)
    else if(!(/(https|http):\/\/(.)+/.test(args.join(' '))))
      command.ytQuery(useProps)

  },

  async listOptions(p, n) {
    let option = p, optionsInfo

    optionsInfo = songs
      .slice(p, n)
      .map(video => `**${option+=1}** ➜ <:youtube:817569761881227315> **\`${video.title ?? video.name}\`** \n`)

    return optionsInfo.length !== 0 ? optionsInfo : '`Nenhum resultado`'
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
        if (data.error) return channel.send(embed.setDescription('<:error:773623679459262525> não foi possível reproduzir essa música.'))
        
        if (playlist) {
          
          collectionProps.songs = songs = data.videos.map(v => ({ url: `https://youtube.com/watch?v=${v.videoId}`, ...v }))
          
          command.listOptions(0, 10).then(async d => {
            collectionProps.msg.edit({
              content: '',
              embed: embedPlaylist({ title: data.title, thumbnail: data.thumbnail, description: d, color: '#E62117' })
            })

            await collectionProps.msg.react('<:newarquive:826555162201161828>')
            collectionProps.emjPrev = await collectionProps.msg.react('\⬅️')
            collectionProps.emjNext = await collectionProps.msg.react('\➡️')
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
      .catch(_=> collectionProps.msg.delete())
  },

  async ytQuery(useProps) {
    const [messageProps, useMessageProps] = useProps, { collectionProps, args, embed, message: { channel, author } } = messageProps

    if (args.length == 0) return channel.send( embed.setDescription(`<@${author.id}>, digite o título da música ou a url.\n\n**Exemplos**:\n\n**Spotify**\n**\`${PREFIX}${command.name} spotify soja - prison blues\`**\n**\`${PREFIX}${command.name} URL\`**\n\n**Youtube**\n**\`${PREFIX}${command.name} youtube Isaac gracie - hollow crown\`**\n**\`${PREFIX}${command.name} Isaac gracie - hollow crown\`**\n**\`${PREFIX}${command.name} URL\`**`))

    collectionProps.msg = await channel.send('<a:load:771895739672428594>')

    search({ query: args.join(' ').toLowerCase(), limit: 20 })
      .then(data => {
        if (data.error) return channel.send(embed.setDescription('<:error:773623679459262525> não foi possível reproduzir essa música.'))

        collectionProps.songs = songs = data?.videos ?? []

        command.listOptions(0, 10).then(async d => {
            collectionProps.msg.edit({ content: '', embed: embedListOptions(d, '#E62117') })

            collectionProps.emjPrev = await collectionProps.msg.react('\⬅️')
            collectionProps.emjNext = await collectionProps.msg.react('\➡️')
            await collectionProps.msg.react('<:cancel:832394115609264158>')
            useMessageProps(messageProps)

            collectMessageOption(useProps)
            collectReactionNext(useProps)
            collectReactionPrev(useProps)
            collectReactionCancel(useProps)
          })
      })
      .catch(_=> collectionProps.msg.delete())
  }
}

export default command