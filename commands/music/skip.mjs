import helpers from '../../modules/helpers.mjs'
import { finish } from '../../modules/songState.mjs'

const command = {
  name: 'sk',
  description: 'Pula a música e começa a próxima na lista se houver.',
  execute(useProps) {
    const [{ voiceChannel, embed, streaming },] = useProps
    const songsProps = streaming.get(voiceChannel?.id)

    if (!voiceChannel || !songsProps?.connection) return

    embed
      .setColor(helpers.colorRadomEx())
      .setDescription('<:skip:633071783351812096> **Skipped**');

    songsProps.broadcastDispatcher.destroy()

    finish(useProps, voiceChannel)
  }
}

export default command