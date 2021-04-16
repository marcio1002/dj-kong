import { spAlbums } from '../../modules/search_spy.mjs'
import permissionVoiceChannel from '../../modules/permissionVoiceChannel.mjs'
import helpers from '../../modules/helpers.mjs'
import { embedListOptions, embedPlaylist } from '../../modules/messageEmbed.mjs'
import { 
  collectReactionNext, 
  collectReactionPrev, 
  collectReactionCancel,
  collectMessageOption,
  collectReactionConfirm,
  sendConnection
} from '../../modules/play.mjs'

let songs

const command = {
  name: 'album',
  description: 'Toca albums do spotify',
  exemple: `\n**Como usar:**\`\`\`${PREFIX}album The Best Of 2Pac\n\n${PREFIX}album album URL\`\`\``,
  execute(useProps) {
    let { args, embed, message: { channel, author } } = useProps[0]

    if (!permissionVoiceChannel(useProps)) return

    if (args.length == 0) return channel.send(embed.setDescription(`<@${author.id}>, digite \`${PREFIX}help ${command.name}\` para obter ajuda.`))

    useProps[0].collectionProps = { author, embed, color: '#1DB954', listOptions: command.listOptions, emojiPlayer: { prev: '\⬅️', next: '\➡️' } }

    if(helpers.isSpotifyURL(args.join(' ')))
      command.urlAlbum(useProps)
    else if(!(/(https|http):\/\/(.)+/.test(args.join(' '))))
      command.queryAlbum(useProps)

  },

  async listOptions(pageStart, pageEnd) {
    let option = pageStart, optionsInfo

    optionsInfo = songs
      .slice(pageStart, pageEnd)
      .map(video => `**${option += 1}** ➜ <:spotify:817569762178629693> **\`${video.title ?? video.name}\`** \n`)

    return optionsInfo.length !== 0 ? optionsInfo : '`Nenhum resultado`'
  },

  async urlAlbum(useProps) {
    const [messageProps, useMessageProps] = useProps, { collectionProps, args, embed, message: { channel, author } } = messageProps

    let  match = args.join(' ').match(/album\/\b(.)+(?=si=(.)+)?/)

    if (!match) return channel.send(embed.setDescription(`<:error:773623679459262525> <@${author.id}> link inválido`))

    collectionProps.msg = await channel.send('<a:load:771895739672428594>')

    spAlbums({
      urlId: match[0].replace(/album\//,''),
      success: async ({ data }) => {
        if (data.error) return channel.send(embed.setDescription('<:error:773623679459262525> não foi possível reproduzir essa música.'))
        
        let album = helpers.formatSpAlbum(data)
        collectionProps.songs = songs = data?.tracks?.items.map(i => ({ album, ...i })).map(helpers.formatSpTrack) ?? []
      
        command.listOptions(1,10).then(async d => {
          collectionProps.msg.edit({
            content: '',
            embed: embedPlaylist({ title: data.name, thumbnail: data.images[1]?.url, description: d, color: collectionProps.color })
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

        
      },
      error: err => (console.error(err), collectionProps.msg.delete())
    })
  },

  async queryAlbum(useProps) {

  }
}

export default command