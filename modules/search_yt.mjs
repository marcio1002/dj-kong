import yt from 'yt-search'

const search = ({ options, success, error }) => yt(options).then(success).catch(error)

export default search