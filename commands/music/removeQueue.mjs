const command = {
  name: 'remove',
  description: 'Remove uma ou mais música da playlist.',
  exemple: `\n**Como usar:**\n\`\`\`${PREFIX}remove 1\n\n${PREFIX}remove Boundary Run\n\nou\n\n${PREFIX}remove 1 10 começo = 1 fim = 10\`\`\``,
  
  async execute([messageProps, setMessageProps]) {
    let { voiceChannel, embed, args, streaming, message: { channel, author } } = messageProps
    let songsProps = streaming.get(voiceChannel?.id), value, msg, eventReaction, songsDeleting = []

    if (!voiceChannel || !songsProps?.connection || songsProps?.queues?.length == 0) return
    if (args.length == 0) return channel.send( embed.setDescription(`<@${author.id}>, você precisa selecionar a música para remover. Digite \`${PREFIX}help ${command.name}\` para obter ajuda.`) )

    args = args.length == 2 && args.every(i => !isNaN(Number(i))) ? args : args.join(' ')

    if (Array.isArray(args) || !isNaN(Number(args))) {
      args = Array.isArray(args) ? args.map(i => Number(i)) : Number(args)

      if(args.length == 2) {
        const [start, deleteItem] = args
        songsDeleting = songsProps.queues.slice(start - 1, deleteItem) ?? []
        value = songsDeleting.map(i => i.title).join('\n')
      }else 
        if (songsProps.queues[args - 1]) value = songsDeleting[0] = songsProps.queues[args - 1]

    } else {
      value = songsDeleting[0] = songsProps.queues.find(s => RegExp(`^${args}`, 'i').test(s.title))
    }

    if (value && songsDeleting) {
      msg = await channel.send( embed.setDescription(`<:alert:773623678830903387> <@${author.id}> realmente deseja remover \n**\`\`${value.title ?? value}\`\`** ?`) )

      await msg.react('<:check:825582630158204928>')
      await msg.react('<:error:773623679459262525>')

      const filter = (reaction, msgAuthor) => ['825582630158204928', '773623679459262525'].includes(reaction.emoji.id) && msgAuthor.id == author.id

      eventReaction = msg
        .createReactionCollector(filter, { max: 1, time: 50000 })
        .on('collect', async r => {
          if(r.emoji.id == "773623679459262525")
            eventReaction.stop()
          else {
            songsProps.queues = await songsProps.queues.filter(i => !songsDeleting.includes(i))
            setMessageProps(messageProps)
            channel.send('Removido \\👍🏾')
          }
        })
        .on('end', _=> msg.delete())
        
    } else 
      (await channel.send(`Não achei essa música na lista.`)).delete({ timeout: 8000 })
  }
}

export default command