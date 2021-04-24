import { reproduce } from './songState.mjs'
import { embedPlaylist, embedListOptions } from './messageEmbed.mjs'

let prev = 0, next = 10


function sendConnection(useProps, data) {
  const [messageProps, setMessageProps] = useProps, { voiceChannel, streaming, broadcast, message: { author, channel } } = messageProps
  const streamConnection = streaming.get(voiceChannel?.id)
  prev = 0, next = 10

  const setSongs = connectionId => {
    streaming.get(connectionId).playlist =  data?.playlist ? { title: data.title, thumbnail: data.thumbnail } : false 
    Array.isArray(data) ? streaming.get(connectionId).queues.push(...data) : streaming.get(connectionId).queues.push(data)
  }

  if (!streamConnection && streamConnection?.voiceChannel?.id !== voiceChannel?.id)
    voiceChannel
      .join()
      .then(connection => {
        streaming.set(connection.channel.id, {
          connection,
          voiceChannel,
          broadcast,
          channel,
          authorConnection: author,
          queues: [],
          current: null,
          played: null,
          speaking: false
        })
        
        setSongs(connection.channel.id)

        setMessageProps(messageProps)
        reproduce(useProps)
      })
      .catch(_ => console.warn('Erro ao conectar no canal de voz'))
  else {
    setSongs(voiceChannel?.id)
    setMessageProps(messageProps)
    reproduce(useProps)
  }

}

function collectReactionConfirm(useProps) {
  const [messageProps, useMessageProps] = useProps, { collectionProps: { msg , songs, type }, message: { author } } = messageProps

  const filter = (reaction, user) => reaction.emoji.id == '825582630158204928' && user.id == author.id

  msg
    .createReactionCollector(filter, { time: 80000 })
    .on('collect', _ => {
      messageProps.collectionProps.messageCollector.stop()
      messageProps.collectionProps.songs = []
      songs.playlist = true
      messageProps.collectionProps = null
      useMessageProps(messageProps)
      sendConnection(useProps, songs)
    })
}

function collectReactionCancel([messageProps, useMessageProps]) {
  const { message: { author } } = messageProps
  const filter = (reaction, reactionAuthor) => reaction.emoji.id == '832394115609264158' && reactionAuthor.id == author.id

  messageProps.collectionProps.msg
    .createReactionCollector(filter, { time: 80000 })
    .on('collect', _ => {
      prev = 0, next = 10
      messageProps.collectionProps.messageCollector.stop()
      messageProps.collectionProps = null
      useMessageProps(messageProps)
    })
}

function collectReactionPrev(useProps) {
  const { collectionProps: {  msg, author, type, songTitle, songs, listOptions, color } } = useProps[0]
  
  const filterEmjPrev = (reaction, user) => reaction.emoji.name == '\⬅️' && user.id == author.id

  msg
    .createReactionCollector(filterEmjPrev, { time: 80000 })
    .on('collect', r => {
      r.users.remove(author.id)

      listOptions(prev -= 10, next -= 10).then(op => {
        if(typeof op == 'string' ) {
          prev += 10, next += 10
          return
        } 
        
        msg.edit({
          content: '',
          embed: (type == 'playlist') ?
            embedPlaylist({ title: songs.title, thumbnail: songs.thumbnail, description: op, color }) :
            embedListOptions(songTitle, color, op)
        })
      })

      
    })
}

function collectReactionNext(useProps) {
  
  const { collectionProps: { msg, author, type, songTitle, songs, listOptions, color } } = useProps[0]

  const filterEmjNext = (reaction, user) => reaction.emoji.name == '\➡️' && user.id == author.id

  msg
    .createReactionCollector(filterEmjNext, { time: 80000 })
    .on('collect', r => {
      r.users.remove(author.id)

      listOptions(prev = next, next += 10).then(op => {
        if(typeof op == 'string' ) {
          prev -= 10, next -= 10
          return
        }

          msg.edit({
            content: '',
            embed: (type == 'playlist') ?
              embedPlaylist({ title: songs.title, thumbnail: songs.thumbnail, description: op, color }) :
              embedListOptions(songTitle, color, op)
          })
        })
    })
}

function collectMessageOption(useProps) {
  const [messageProps, useMessageProps] = useProps
  let song, { collectionProps: { msg, songs, type }, message: { author } } = messageProps

  const filter = m => m.author.id === author.id && !isNaN(Number(m.content))

  messageProps.collectionProps.messageCollector = msg.channel
    .createMessageCollector(filter, { max: 1, maxUsers: 1, time: 100000 })
    .on('collect', select => {
      if (!(song = songs[Number(select.content) - 1])) return
      messageProps.collectionProps = null
      useMessageProps(messageProps)

      sendConnection(useProps, song)
    })
    .on('end', _ => (msg.delete(),  prev = 0, next = 10))
}

export { 
  sendConnection, 
  collectReactionPrev, 
  collectReactionNext, 
  collectReactionConfirm, 
  collectReactionCancel,
  collectMessageOption
}