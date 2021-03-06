const yt=require("yt-search")

const search = async (content) => await yt(content)

module.exports = search