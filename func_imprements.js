const ytdl = require('ytdl-core');

module.exports = {
    colorRadomEx: () => {
        let letters = "123456789ABCDEFGH";
        color = "#";
        for (let c = 0; c < 6; c++) {
            color += letters[Math.floor(Math.random() * 12)];
        }
        return color;
    },
    selectOption: (arg) => {
        const numbers = "12345678910";
        if (!arg || arg.length === 0) return channel.send(`Nenhuma opção escolhida`);
        if (arg.length > 2 || !numbers.includes(arg)) return;
        const option = Number(arg) - 1;
        return option;
    },
    playMusic: async (voiceChannel,connection, songs,message,embedSong)  => {
        const {channel} = message;
        let embedDesc;
        let embedTitle;
        let song ;

        let songInfo = {
            "title":String,
            "image": String,
            "url": String,
            "timeStamp": String,
        }

        if (connection.dispatcher) {
            songInfo = {
                title: songs['title'],
                image: songs['image'],
                url: songs['url'],
                timeStamp: songs['timestamp']
            }   

            connection.receivers.push([songInfo]);
            
            embedDesc =  `**foi adicionado na fila:** \n [${songs['title']}](${songs['url']}) `;
            embedSong
            .setDescription(embedDesc)

            channel.send(embedSong);
        } else {
            songInfo = {
                title: songs['title'],
                image: songs['image'],
                url: songs['url'],
                timeStamp: songs['timestamp']
            }   
            connection.receivers.push([songInfo]);
            song = connection.receivers[0][0];
            const dispatcher = await connection.playStream(ytdl(song.url));

            dispatcher.on("start", () => {
                
                embedTitle =  "Tocando <a:Ondisco:630470764004638720> ``"+song.title+"``";
                embedDesc = `Duração: ${song.timestamp} \n [Video](${song.url})`;
                embedSong
                .setDescription(embedDesc)
                .setTitle(embedTitle)
                .setThumbnail(song.image);
                
                channel.send(embedSong);
            });
            
            dispatcher.stream.on("end", () => {

                if (voiceChannel.members.size <= 1) return connection.disconnect();
                if (!songInfo.url) return;
                    if(connection) {

                        const obj = connection.receivers[0].values();
                        console.log(obj);
                        // embedTitle =  "Tocando <a:Ondisco:630470764004638720> ``"+obj.title.next()+"``";
                        // embedDesc = `Duração: ${obj.timestamp.next()} \n [Video](${obj.url.next()})`;

                        // connection.playStream(ytdl(url.next()));
                        // embedSong
                        //     .setDescription(embedDesc)
                        //     .setTitle(embedTitle)
                        //     .setThumbnail(obj.image.next());
                
                        // channel.send(embedSong);

                    }
            });
            dispatcher.stream.on('error', error => console.log(error));
        }

        connection.on("disconnect", () => connection.receivers = [] );
    },
}