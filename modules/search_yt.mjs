import yt from 'yt-search'

const search = (options) => {
  return new Promise((resolve, reject) => {
    try {
      yt(options).then(resolve).catch(reject)
    } catch (error) {
      reject(error)
    }
  })
}

export default search