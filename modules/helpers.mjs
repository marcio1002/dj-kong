const helpers = {

    colorRadomEx() {
        let letters = "123456789ABCDEFGH";
        let color = "#";
        for (let c = 0; c < 6; c++) 
            color += letters[Math.floor(Math.random() * 12)];

        return color;
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
        const minutes = Math.floor(ms / 60000);
        const seconds = ((ms % 60000) / 1000).toFixed(0);
        return [minutes, seconds < 10 ? `0 ${seconds}` : seconds].join(":")
    },

    isSpotify(songs) {
        return /(https|http)?\/\/(open\.spotify\.com)/.test(songs.url)
    }

}

export default  helpers