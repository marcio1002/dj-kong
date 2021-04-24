import Discord from 'discord.js'
import helpers from '../../utils/helpers.mjs'

let options = [], embedQueues, prev, next

const command = {
  name: 'ls',
  description: 'Lista as músicas da playlist.',
  exemple: `\n**Como usar:**\n\`\`\`${PREFIX}ls\`\`\``,

  async listQueues(p, n) {
    let songQueues = [], index = p

    options
      .slice(p,n)
      .forEach(song => songQueues.push(`**${index+=1} ➜** <:pastaMusic:630461639208075264> [**\`\`${song.title}\`\`**](${song.url}) \n`))

    return songQueues.length > 0 ? songQueues : '**``Playlist vazia``**'
  },

  sendEmbedQueues(op) {
    if(!embedQueues) embedQueues = new Discord.MessageEmbed

    return embedQueues
      .setColor(helpers.colorRadomEx())
      .setTitle('Minha playlist.')
      .setDescription(op)
  },

  collectReactionPrev({ msg, author }) {
    const filter = (reaction, msgAuthor) => reaction.emoji.name == '\⬅️' && msgAuthor.id == author.id
    msg
      .createReactionCollector(filter, { time: 80000 })
      .on('collect', r => {
        r.users.remove(author.id)

        command.listQueues(prev -= 10, next -= 10)
          .then(op => {
            if(typeof op == 'string') {
              prev += 10, next += 10
              return
            }
            msg.edit({ content: '', embed: command.sendEmbedQueues(op) })
          })
      })
  },

  collectReactionNext({ msg, author }) {
    const filter = (reaction, msgAuthor) => reaction.emoji.name == '\➡️' && msgAuthor.id == author.id

    msg
      .createReactionCollector(filter, { time: 80000 })
      .on('collect', r => {
        r.users.remove(author.id)

        command.listQueues(prev = next, next += 10)
          .then(op => {
            if(typeof op == 'string') {
              prev -= 10, next -= 10
              return
            }
            msg.edit({ content: '', embed: command.sendEmbedQueues(op) })
          })
      })
  },

  async execute([{ voiceChannel, embed, streaming, message: { channel, author } },]) {
    let msg, songsProps = streaming.get(voiceChannel?.id)
    if (!voiceChannel || !songsProps?.connection) return

    prev = 0, next = 10
    options = songsProps.queues

    command.listQueues(prev, next)
      .then(async op => {
        msg = await channel.send(command.sendEmbedQueues(op))
        msg.delete({ timeout: 65000 })

        if(typeof op == 'string' || options?.length <= 10) return
        
        await msg.react('\⬅️')
        await msg.react('\➡️')

        command.collectReactionPrev({ msg, author, embed })
        command.collectReactionNext({ msg, author, embed })
      })
  }
}

export default command