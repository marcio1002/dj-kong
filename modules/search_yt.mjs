import yt from 'yt-search'

const search = (options) => {
  return new Promise( async (resolve, reject) => {
    try {
      resolve(await yt(options))
    } catch (error) {
      reject(error)
    }
  })
}

export default search