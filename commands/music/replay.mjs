import Discord from 'discord.js'
import helpers from '../../modules/helpers.mjs'
import { sendMessage , disconnect, reproduceSpotify, reproduceYoutube } from '../../modules/songState.mjs'

const command = {
  name: 'rp',
  description: 'Reproduz a música anterior.',
  async execute(useProps) {
    const [ messageProps, setMessageProps] = useProps
    const { voiceChannel, streaming, broadcast, message: { channel } } = messageProps
    let current,broadcastDispatcher,dispatcher
    const songsProps = streaming.get(voiceChannel?.id)

    if (!voiceChannel || !songsProps?.connection || !broadcast || songsProps.played == null) return

    current = songsProps.current
    songsProps.current = songsProps.played
    songsProps.played = current


    songsProps.connection
    .once('error',  _=> songsProps.connection.disconnect() )
    .once('disconnect', _=> disconnect(useProps))

    broadcastDispatcher = helpers.isSpotify(songsProps.current) ? await reproduceSpotify(songsProps.current, useProps) :  await reproduceYoutube(songsProps.current, useProps)

    dispatcher = await songsProps.connection
      .play(broadcast)
      .once('start', _ => sendMessage(useProps))
      .once('error', _ => songsProps.connection.disconnect())
      .once('failed', _ => {
        channel.send(
          (new Discord)
            .setColor(helpers.colorRadomEx())
            .setDescriptionce(`<:error:773623679459262525> Não foi possível reproduzir a música.\nA causa do erro pode ser pelo tempo da espera da conexão ou porque o vídeo sugerido é privado.`)
        )
      })

    songsProps.broadcastDispatcher = broadcastDispatcher
    songsProps.dispatcher = dispatcher
    setMessageProps(messageProps)
  },
}

export default command