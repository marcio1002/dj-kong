const command = {
  name: 'remove',
  description: 'Remove a música escolhida da lista de espera.',
  exemple: `\n**Como usar:**\n\`\`\`${PREFIX}remove + número\nou\n${PREFIX}remove + título\`\`\``,
  async execute([messageProps, setMessageProps]) {
    let { voiceChannel, embed, args, streaming, message: { channel, author } } = messageProps
    let songsProps = streaming.get(voiceChannel?.id), value, msg, index, eventReaction

    if (!voiceChannel || !songsProps?.connection || songsProps?.queues?.length == 0) return
    if (args.length == 0) return channel.send( embed.setDescription(`<@${author.id}>, você precisa selecionar a música para remover. Digite \`${PREFIX}help ${command.name}\` para obter ajuda.`) )

    args = args.join(' ')

    if (!isNaN(Number(args))) {
      args = Number(args) - 1
      if (songsProps.queues[args]) value = songsProps.queues[args], index = args
    } else {
      value = songsProps.queues.find(s => RegExp(`^${args}`, 'i').test(s.title))
      index = songsProps.queues.findIndex(s => RegExp(`^${args}`, 'i').test(s.title))
    }

    if (value && index >= 0) {
      msg = await channel.send( embed.setDescription(`<:warning:773623678830903387> <@${author.id}> realmente deseja remover **\`\`${value.title}\`\`** ?`) )

      await msg.react('<:check:825582630158204928>')
      await msg.react('<:error:773623679459262525>')

      const filter = (reaction, msgAuthor) => ['825582630158204928', '773623679459262525'].includes(reaction.emoji.id) && msgAuthor.id == author.id

      eventReaction = msg
        .createReactionCollector(filter, { max: 1, time: 50000 })
        .on('collect', r => {
          if(r.emoji.id == "773623679459262525")
            eventReaction.stop()
          else
            if(songsProps.queues.splice(index, 1).length > 0) channel.send('Removido \\👍🏾')
        })
        .on('end', _=> msg.delete())
        
    } else 
      (await channel.send(`Não achei essa música na lista.`)).delete({ timeout: 8000 })

    setMessageProps(messageProps)
  }
}

export default command