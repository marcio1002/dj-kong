import { spAlbums } from '../../utils/search_spy.mjs'
import permissionVoiceChannel from '../../utils/permissionVoiceChannel.mjs'
import helpers from '../../utils/helpers.mjs'
import { embedPlaylist } from '../../utils/messageEmbed.mjs'
import {
  collectReactionNext,
  collectReactionPrev,
  collectReactionCancel,
  collectMessageOption,
  collectReactionConfirm,
} from '../../utils/play.mjs'

let songs, searchTitle, songTitle = 'Para selecionar o album digite o número que está na frente do título.'

const command = {
  name: 'album',
  description: 'Toca albums do spotify',
  exemple: `\n**Como usar:**\`\`\`${PREFIX}album The Best Of 2Pac\n\n${PREFIX}album album URL\`\`\``,
  execute(useProps) {
    let { args, embed, message: { channel, author } } = useProps[0]

    if (!permissionVoiceChannel(useProps)) return

    if (args.length == 0) return channel.send(embed.setDescription(`<@${author.id}>, digite \`${PREFIX}help ${command.name}\` para obter ajuda.`))

    useProps[0].collectionProps = { author, embed, songTitle, color: '#1DB954', listOptions: command.listOptions, emojiPlayer: { prev: '\⬅️', next: '\➡️' } }
    searchTitle = args.join(' ')

    if (helpers.isSpotifyURL(args.join(' ')))
      command.urlAlbums(useProps)
    else if (!(/(https|http):\/\/(.)+/.test(args.join(' '))))
      command.queryAlbums(useProps)

  },

  async listOptions(pageStart, pageEnd) {
    let option = pageStart, optionsInfo

    optionsInfo = songs
      .slice(pageStart, pageEnd)
      .map(video => `**${option += 1}** ➜ <:spotify:817569762178629693> **\`${video.title ?? video.name}\`** \n`)

    return optionsInfo.length !== 0 ? optionsInfo : `\`Nenhum resultado relacionado a "${searchTitle}"\` `
  },

  async getAlbum(useProps, search) {
    const [messageProps, useMessageProps] = useProps, { collectionProps, embed, message: { channel } } = messageProps

    spAlbums({
      urlId: search,
      success: ({ data }) => {
        if (!data || data.error) {
          collectionProps.msg.delete()
          return channel.send(embed.setDescription(`<:error:773623679459262525> não encontrei nada relacionado a **\`${searchTitle}\`**.`))
        }

        let album = helpers.formatSpAlbum(data)
        collectionProps.songs = songs = data?.tracks?.items.map(helpers.formatSpTrack).map(i => ({ album, ...i })) ?? []
        collectionProps.songs.title = album.name
        collectionProps.songs.thumbnail = album.thumbnail
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


      },
      error: err => (console.error(err), collectionProps.msg.delete())
    })
  },

  async urlAlbums(useProps) {
    const { collectionProps, args, embed, message: { channel, author } } = useProps[0]

    let match = args.join(' ').match(/album\/\b(.)+(?=si=(.)+)?/)

    if (!match) return channel.send(embed.setDescription(`<:error:773623679459262525>  link inválido`))

    collectionProps.msg = await channel.send('<a:load:771895739672428594>')

    command.getAlbum(useProps, match[0].replace(/album\//, ''))
  },

  async queryAlbums(useProps) {
    const { collectionProps, args, message: { channel } } = useProps[0]

    collectionProps.msg = await channel.send('<a:load:771895739672428594>')

    spAlbums({
      query: args.join(' '),
      success: ({ data }) => {
        if (!data || data.error) {
          collectionProps.msg.delete()
          return channel.send(`Não encontrei nenhum album com o nome **\`${searchTitle}\`**`)
        }

        data = helpers.formatSpTrack(data?.items[0])
        let match = data.url.match(/album\/\b(.)+(?=si=(.)+)?/)

        if (!match) {
          collectionProps.msg.delete()
          return channel.send(`Não encontrei nenhum album com o nome **\`${searchTitle}\`**`)
        }

        command.getAlbum(useProps, match[0].replace(/album\//, ''))
      }
    })
  }
}

export default command