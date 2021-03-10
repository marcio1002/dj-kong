const helpers = {

    colorRadomEx() {
        let letters = "123456789ABCDEFGH";
        let color = "#";
        for (let c = 0; c < 6; c++) 
            color += letters[Math.floor(Math.random() * 12)];

        return color;
    },

    getTimeStamp() {
        return (new Date(Date.now())).toLocaleTimeString("pt-BR").split(":").filter((_, i) => i != 2).join(":")
    },

    getDate() {
        return (new Date(Date.now())).toLocaleDateString("pt-BR").split("/").join("-")
    }
}

export default  helpers