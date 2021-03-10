import Spotify from 'node-spotify-api'

const spy = new Spotify({
  id: process.env.SPOTIFY_ID,
  secret: process.env.SPOTIFY_SECRET
})

const search = async (options) => await spy.search({type: options.type ?? 'track', query: options.query ?? ''})


export default search