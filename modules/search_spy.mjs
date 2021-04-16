import Spotify from 'node-spotify-integration'

const spy = Spotify(
  process.env.SPOTIFY_ID,
  process.env.SPOTIFY_SECRET
)

const spTracks = ({ query = null, urlId = null, success, error }) => {
  if (urlId != null)
    spy.tracks.byId(urlId).then(success).catch(error)
  else if(query)
    spy.tracks.search(query).then(success).catch(error)

}

const spAlbums = ({ query = null, urlId = null, success, error }) => {
  if (urlId)
    spy.albums.byId(urlId).then(success).catch(error)
  else if(query)
    spy.albums.search(query).then(success).catch(error)
}

const spArtists = ({ query = null, urlId = null, success, error }) => {
  if (urlId)
    spy.artists.byId(urlId).then(success).catch(error)
  else if(query)
    spy.artists.search(query).then(success).catch(error)
}

export { spTracks, spAlbums, spArtists }