const command = {
  name: 'clear',
  description: 'Remove todas as músicas da playlist.',
  exemple: `\n**Como usar:**\n\`\`\`${PREFIX}clear\`\`\``,
  async execute([messageProps, useMessageProps]) {
    const { voiceChannel, streaming, embed, message: { channel, author } } = messageProps
    const songsProps = streaming.get(voiceChannel?.id)

    if (!voiceChannel || !songsProps?.connection) return

    if(songsProps.queues.length == 0) return channel.send(embed.setDescription(`<@${author.id}>, a playlist já está vazia`))

    
    let msg = await channel.send( embed.setDescription(`<:warning:773623678830903387> <@${author.id}> realmente deseja limpar a playlist?`) )

      await msg.react('<:check:825582630158204928>')
      await msg.react('<:error:773623679459262525>')

      const filter = (reaction, msgAuthor) => ['825582630158204928', '773623679459262525'].includes(reaction.emoji.id) && msgAuthor.id == author.id

      msg
        .createReactionCollector(filter, { max: 1, time: 50000 })
        .on('collect', r => {
          if(r.emoji.id == "825582630158204928") {
            songsProps.queues = []
            useMessageProps(messageProps)
            channel.send('Playlist limpa \\👍🏾')
          }
        })
        .on('end', _=> msg.delete())
       
  }
}


export default command