import search from "../../modules/search_spy.mjs"
import Spdl from 'spdl-core'

const spdl = Spdl.default

const command = {
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