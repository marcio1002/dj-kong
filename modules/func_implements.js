const implements = {

    colorRadomEx() {
        let letters = "123456789ABCDEFGH";
        color = "#";
        for (let c = 0; c < 6; c++) 
            color += letters[Math.floor(Math.random() * 12)];

        return color;
    },

    getTimeStamp() {
        let d = (new Date(Date.now())).toLocaleTimeString().split(":")
        return d
                .slice(0,2)
                .map(v => String(v).length == 1 ? `0${v}` : v )
                .join(":")
    },

    getDate() {
        let d = (new Date(Date.now())).toLocaleDateString().split("-").reverse()
        return d
            .filter(v => /\D/.test(v))
            .map(v => String(v).length == 1 ? `0${v}` : v )
            .join("-")
            .replace("/","-")
            .replace("/","-")
    }

}

module.exports = implements