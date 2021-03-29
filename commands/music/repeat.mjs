import Discord from 'discord.js'
import helpers from '../../modules/helpers.mjs'
import { play, disconnect, reproduceSpotify, reproduceYoutube } from '../../modules/songState.mjs'

const command = {
  name: 'rp',
  description: 'Reproduz a música anterior.',
  exemple: `\n**Como usar:**\n\`\`\`${PREFIX}rp\`\`\``,
  async execute(useProps) {
    const [messageProps,] = useProps, { voiceChannel, streaming } = messageProps, songsProps = streaming.get(voiceChannel?.id)
    let current

    if (!voiceChannel || !songsProps?.connection || !songsProps?.broadcast) return

    if(songsProps.speaking && songsProps.current && songsProps.played) songsProps.queues.unshift(songsProps.current)

    current = songsProps.current
    songsProps.current = songsProps.played ?? songsProps.current
    songsProps.played = current

    if(!songsProps.current) return

    songsProps.connection
      .once('error', _ => songsProps.connection.disconnect())
      .once('disconnect', _ => disconnect(useProps))

      helpers.isSpotify(songsProps.current) ? 
        reproduceSpotify(songsProps.current, useProps).then(broadcastDispatcher => play(useProps, broadcastDispatcher)) : 
        reproduceYoutube(songsProps.current, useProps).then(broadcastDispatcher => play(useProps, broadcastDispatcher))  
  },
}

export default command