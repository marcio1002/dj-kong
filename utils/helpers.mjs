const helpers = {

    colorRadomEx() {
        return '#' + (Math.floor(Math.random()*0xFFFFFF<<0)).toString(16)
    },

    getTimeStamp(createdTimestamp) {
        return (new Date(createdTimestamp ?? Date.now()))
            .toLocaleTimeString('pt-Br',{ timeZone: 'America/Sao_Paulo'})
            .replace(/:\d{2}$/,"")
    },

    getDate(createdTimestamp) {
        return (new Date(createdTimestamp ?? Date.now()))
            .toLocaleDateString('pt-Br',{ timeZone: 'America/Sao_Paulo'})
            .split("\/")
            .join("-")
    },

    songTimeStamp(ms) {
        const hours = Math.floor(ms / 60000)
        const minutes = Math.floor((ms % 60000) / 1000)
        return [hours, minutes].map(v => v.toString().padStart(2,'0')).join(":")
    },

    isSpotifyURL(url) {
        return /(https|http)?\/\/(www\.)?(open\.spotify\.com)\/(track|album|artist)/.test(url)
    },

    isYoutubeURL(url) {
        return /(https|http):\/\/(www\.)?(youtube\.com|youtu\.be){1}/.test(url)
    },

    formatSpTrack(data) {
        return {
            url: data.external_urls.spotify,
            title: data.name,
            timestamp: helpers.getTimeStamp(data.duration_ms),
            ...(data?.album) ? { album: helpers.formatSpAlbum(data.album) } : {}
          }
    },
    
    formatSpAlbum({ name, images, artists, external_urls, thumbnail }) {
        return {
            name,
            thumbnail: images[1]?.url,
            artists,
            external_urls
        }
    },

    formatYtQuery({ title, url, duration, thumbnail, channel }) {
        return {
            title,
            url,
            thumbnail: thumbnail.url,
            timestamp: helpers.songTimeStamp(duration),
            channel: { title: channel.name, url: channel.url }
        }
    },

    formatYtPlayList({ title, url, videos, duration, thumbnail, channel }) {
        return {
            title,
            url,
            videos,
            thumbnail,
            channel: { title: channel.name, url: channel.url }
        }
    }

}

export default  helpers