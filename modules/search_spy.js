const Spotify =  require('node-spotify-api')
const spy = new Spotify({
  id: process.env.SPOTIFY_ID,
  secret: process.env.SPOTIFY_SECRET
})

const search = async (options) => {
  return await spy.search({type: options.type ?? 'track', query: options.query ?? ''})
}

module.exports = search