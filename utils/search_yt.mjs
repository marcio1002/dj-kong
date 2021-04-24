import Youtube from 'youtube-sr'

const yt = Youtube.default

const ytVideo = ({ video, videoId, options = {} }) => {
  options.limit = options?.limit ?? 25
  options.safeSearch = options?.safeSearch ?? true

  return video ? yt.search(video, options) : yt.getVideo(`https://youtu.be/${videoId}`, options)
}

const ytPlaylist = ({ listId, options = {} }) => {
  options.limit = options?.limit ?? 25
  options.safeSearch = options?.safeSearch ?? true

  return yt.getPlaylist(`https://youtube.com/playlist?list=${listId}`, options)
}

export { ytVideo, ytPlaylist }