module.exports = {

    colorRadomEx() {
        let letters = "123456789ABCDEFGH";
        color = "#";
        for (let c = 0; c < 6; c++) {
            color += letters[Math.floor(Math.random() * 12)];
        }
        return color;
    },

    selectOption(arg) {
        const numbers = "12345678910";
        if (!arg || arg.length === 0) return;
        if (arg.length > 2 || !numbers.includes(arg)) return;
        const option = Number(arg) - 1;
        return option;
    },

    getTimeStamp() {
        let d = (new Date).toLocaleTimeString().split(":")
        d[0] = d[0].length == 1 ? `0${d[0]}` : d[0]
        d.pop()
        return d.join(":")
    },

    getDate() {
        let d = (new Date).toLocaleDateString().split("-").reverse()
        d[0] =  d[0].length == 1 ? `0${d[0]}` : d[0]
        d[1] =  d[1].length == 1 ? `0${d[1]}` : d[1]
        return d.join("/")
    }

}