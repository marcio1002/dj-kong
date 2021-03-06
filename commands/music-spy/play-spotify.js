const search = require("../../modules/search_spy")
const spdl = require('spdl-core').default

module.exports = {
  name: "spyp",
  description: "Reproduz o audio ou adiciona na fila.",
  async execute([{ voiceChannel, args },]) {
    const list = await search({ query: args.join(" ").toLowerCase() })

    voiceChannel.join()
      .then(async connection => {
        console.log(list.tracks.items[0])
        connection.play(await spdl(list.tracks.items[0].external_urls.spotify))
      })
  },

}