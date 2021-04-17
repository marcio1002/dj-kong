import { spTracks } from '../../modules/search_spy.mjs'
import permissionVoiceChannel from '../../modules/permissionVoiceChannel.mjs'
import helpers from '../../modules/helpers.mjs'
import { embedListOptions } from '../../modules/messageEmbed.mjs'
import {
  collectReactionNext,
  collectReactionPrev,
  collectReactionCancel,
  collectMessageOption,
  sendConnection
} from '../../modules/play.mjs'

let songs, searchTitle, songTitle = 'Para selecionar a música digite o número que está na frente do título.'

const command = {
  name: 'yp',
  description: 'Toca músicas do spotify.',
  exemple: `\n**Como usar:**\n\`\`\`${PREFIX}yp Tupac Ghetto Gospel\n\n${PREFIX}yp spotify URL\`\`\``,
  execute(useProps) {
    let { args, embed, message: { channel, author } } = useProps[0]

    if (!permissionVoiceChannel(useProps)) return

    if (args.length == 0) return channel.send(embed.setDescription(`<@${author.id}>, digite \`${PREFIX}help ${command.name}\` para obter ajuda.`))

    useProps[0].collectionProps = { author, embed, songTitle, color: '#1DB954', listOptions: command.listOptions, emojiPlayer: { prev: '\⬅️', next: '\➡️' } }
    searchTitle = args.join(' ')

    if (helpers.isSpotifyURL(args.join(' ')))
      command.spyUrl(useProps)
    else if (!(/(https|http):\/\/(.)+/.test(args.join(' '))))
      command.spyQuery(useProps)
  },

  async listOptions(pageStart, pageEnd) {
    let option = pageStart, optionsInfo

    optionsInfo = songs
      .slice(pageStart, pageEnd)
      .map(video => `**${option += 1}** ➜ <:spotify:817569762178629693> **\`${video.title ?? video.name}\`** \n`)

    return optionsInfo.length !== 0 ? optionsInfo : `\`Não encontrei ${searchTitle}\``
  },

  async spyUrl(useProps) {
    const [messageProps, useMessageProps] = useProps, { collectionProps, args, embed, message: { channel, author } } = messageProps

    let match = args.join(' ').match(/track\/\b(.)+(?=si=(.)+)?/)

    if (!match) return channel.send(embed.setDescription(`<:error:773623679459262525> <@${author.id}> link inválido`))

    collectionProps.msg = await channel.send('<a:load:771895739672428594>')

    spTracks({
      urlId: match[0].replace('track\/', ''),
      success: ({ data }) => {
        collectionProps.msg.delete()
        useMessageProps(messageProps)

        if (!data || data.error) return channel.send(embed.setDescription(`<:error:773623679459262525> não encontrei nada relacionado a **\`${searchTitle}\`**.`))

        sendConnection(useProps, helpers.formatSpTrack(data))
      },
      error: err => (console.error(err), collectionProps.msg.delete())
    })
  },

  async spyQuery(useProps) {
    const [messageProps, useMessageProps] = useProps, { collectionProps, args, embed, message: { channel, author } } = messageProps

    collectionProps.msg = await channel.send('<a:load:771895739672428594>')

    spTracks({
      query: args.join(' ').toLowerCase(),
      success: async ({ data }) => {
        if (!data || data.error) return channel.send(embed.setDescription(`<:error:773623679459262525> não encontrei nada relacionado a **\`${searchTitle}\`**.`))

        collectionProps.songs = songs = data?.items.map(helpers.formatSpTrack) ?? []
        collectionProps.type = 'query'

        command.listOptions(0, 10).then(async d => {
          collectionProps.msg.edit({
            content: '',
            embed: embedListOptions(collectionProps.songTitle, collectionProps.color, d)
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
      },
      error: console.error
    })
  },
}

export default command