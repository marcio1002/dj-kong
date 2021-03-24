import Discord from 'discord.js'
import helpers from '../../modules/helpers.mjs'
import { sendMessage , disconnect, reproduceSpotify, reproduceYoutube } from '../../modules/songState.mjs'

const command = {
  name: 'rp',
  description: 'Reproduz a música anterior.',
  async execute(useProps) {
    const [ messageProps, setMessageProps] = useProps
    const { voiceChannel, conn, songs, broadcast, message: { channel } } = messageProps
    let current,broadcastDispatcher,dispatcher, song

    if (!voiceChannel || !conn || !broadcast || songs.get('played') == null) return

    current = songs.get('current')
    songs.set('current', songs.get('played'))
    songs.set('played', current)
    song = songs.get('current')

    conn
    .once('error',  _=> conn.disconnect() )
    .once('disconnect', _=> disconnect(useProps))

    broadcastDispatcher = helpers.isSpotify(song) ? await reproduceSpotify(song, useProps) :  await reproduceYoutube(song, useProps)

    dispatcher = await conn
      .play(broadcast)
      .once('start', _ => sendMessage(useProps))
      .once('error', _ => conn.disconnect())
      .once('failed', _ => {
        channel.send(
          (new Discord)
            .setColor(helpers.colorRadomEx())
            .setDescriptionce(`<:error:773623679459262525> Não foi possível reproduzir a música.\nA causa do erro pode ser pelo tempo da espera da conexão ou porque o vídeo sugerido é privado.`)
        )
      })

    songs.set('broadcastDispatcher', broadcastDispatcher)
    songs.set('dispatcher', dispatcher)
    setMessageProps(messageProps)
  },
}

export default command