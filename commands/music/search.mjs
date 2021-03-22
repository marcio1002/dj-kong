const module = {
  name: "search",
  description: "",
  execute(useProps) {

  },
  async spyQuery(useProps) {
    const [messageProps, setMessageProps] = useProps
    const { voiceChannel, args, embed, songs, message: { channel, author } } = messageProps

    spTracks({ query: args.join(" ").toLowerCase() }).then( ({ data }) => {

      if(data.error) {
        embed
          .setDescription("<:error:773623679459262525> não foi possível reproduzir essa música.")
        return channel.send(embed)
      }
      
      songs.set('queues', [...songs.get('queues'), {
        url: data.external_urls.spotify,
        title: data.name,
        timestamp:  helpers.getTimeStamp(data.duration_ms * 60),
        album: data.album
      }])

      setMessageProps(messageProps)

      voiceChannel.join()
        .then(async connection => {
          messageProps.conn = connection
          reproduce(useProps)
        })
    })


  },
}