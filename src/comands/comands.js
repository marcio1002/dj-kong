const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
const cmdImplemts = require("../comands/func_imprements");
const evtsMusic = require("./eventsMusic");
const evt = new evtsMusic;
let song;
let conn = null;
let speaking = false;
let dispatcher;
let songInfo = []
let embedDesc = null;
let embedTitle = null;
let title = "";
let timeStamp = "";
let url = "";
let image = "";

const Comands = {

    avatar: (messageProps) => {
        const { embedSong, mentionUser, memberMentions, message: { channel, author } } = messageProps;
        let avatar;
        let image;
        embedSong
            .setFooter(author.username, author.avatarURL())
            .setColor(cmdImplemts.colorRadomEx())

        if (mentionUser) {
            avatar = memberMentions.user.displayAvatarURL();
            image = memberMentions.user.displayAvatarURL();

        } else {
            avatar = author.displayAvatarURL();
            image = author.displayAvatarURL();
        }
        embedSong
            .setDescription(`<:image:633071783414726666>** [Download do avatar](${avatar})**`)
            .setImage(image);

        channel.send(embedSong);
    },

    help: async (messageProps) => {
        const { embedHelp, message: { channel } } = messageProps;

        embedHelp
            .setTitle("<:que:648555789119914005> **```Help```**")
            .setDescription("Adicione o **``Ondisco``** em outros servidores [Convite](https://discordapp.com/oauth2/authorize?=&client_id=617522102895116358&scope=bot&permissions=8) \n ----------------------------------------------------------")
            .addField("<:music:648556667364966400>", "**Comandos**", false)
            .addFields(
                { name: "``avatar``", value: "Comando para visualizar o avatar do perfil", inline: true },
                { name: "**``play``**", value: "inicia a música", inline: true },
                { name: "**``leave``**", value: "Finalizar a música e sai do canal", inline: true },
                { name: "**``back``**", value: "Continua a música pausada", inline: true },
                { name: "**``pause``**", value: "Pausa a música", inline: true },
                { name: "**``stop``**", value: "Finaliza a música", inline: true },
                { name: "**``vol``**", value: "Aumenta ou diminui o volume.\n **``Min:``** 0   **``Max:``** 4", inline: true },
                { name: "**``skip``**", value: "pula a música que está tocando no momento", inline: true },
                { name: "**``OBS:``**", value: "Você pode cancelar nas opções de música digitando ``cancel``", inline: false },
            );

        const m = await channel.send(embedHelp);
        m.delete({ timeout: 35000 });
    },

    play: async (messageProps) => {
        const { voiceChannel, args,evt, embedSong, message: { channel, author } } = messageProps;
        let option = 1;
        let cont = 1;
        let optionTitle = [];


        if (!voiceChannel) return channel.send(`<:erro:630429351678312506> <@${author.id}> só posso tocar a música se você estiver conectado em um canal de voz`);
        if (voiceChannel.joinable === false || voiceChannel.speakable === false) return channel.send(`<:alert:630429039785410562> <@${author.id}> Não tenho permissão para ingressar ou enviar audio nesse canal.`);
        if (voiceChannel.muted) return channel.send(`<@${author.id}>  não posso enviar audio nesse canal de voz, canal de voz mudo.`);
        if (!voiceChannel.permissionsFor(author.id)) return;
        const member = voiceChannel.permissionsFor(author.id);
        if (!member.has("CONNECT") || !member.has("ADMINISTRATOR")) return channel.send(`<@${author.id}> Você não tem permissão para conectar nesse canal de voz`);
        if (!args.length) return channel.send("<@" + author.id + "> Digite o nome da música que deseja tocar. \n exe: ``!dplay Russ - September 16`` ");

        ytSearch(args.join(" ").toLocaleLowerCase(), async function (err, videoInfo) {
            const listVideos = videoInfo.videos;

            embedSong.setTitle("Selecione a música que deseja tocar digitando um numero entre ``1`` a ``10``");

            for (const video of listVideos) {
                optionTitle.push("** " + option + "** ->  <:streamvideo:633071783393755167> **``" + video['title'] + "``** \n");
                option += 1;
                if (cont === 10) break
                cont += 1;
            }

            embedSong.setDescription(optionTitle);
            const msg = await messageProps.message.reply(embedSong);

            msg.delete({ timeout: 80000 });

            const filter = res => res.author.id === author.id;

            channel.awaitMessages(filter, { max: 1, time: 80000 })
                .then(async sellect => {
                    if (sellect.first().content === "cancel") return channel.send("Música cancelada");

                    let op = await cmdImplemts.selectOption(sellect.first().content);
                    song = listVideos[op];
                    if (!song) return;

                    voiceChannel.join().then(connection => (
                        conn = connection,
                        Comands.playMusic(messageProps)
                    ));
                })
                .catch(err => channel.send(`${author.username} parece indeciso em escolher  uma música !`));
        });
    },

    leave: (messageProps) => {
        const { voiceChannel, embedSong, message: { channel, author } } = messageProps;

        if (!voiceChannel || !conn) return

        embedSong.setTitle("Desconectado do canal ``" + voiceChannel.name + "``");

        conn.disconnect();

        channel.send(embedSong);
    },

    pause: (messageProps) => {
        const { voiceChannel, embedSong, message: { channel, author } } = messageProps;

        if (!voiceChannel) return;
        if (!conn) return channel.send(`<:erro:630429351678312506> <@${author.id}> Não estou conectado no canal de voz para conceder essa função`);

        if (speaking) {
            embedSong
                .setDescription("<:pause:633071783465058334> Paused")
                .setColor(cmdImplemts.colorRadomEx());

            dispatcher.pause(true);
            channel.send(embedSong);
        } else {
            return channel.send(`<@${author.id}>  <:huuum:648550001298898944> nenhuma música tocando nesse canal!`);
        }
    },

    back: (messageProps) => {
        const { voiceChannel, embedSong, message: { channel } } = messageProps;

        if (!voiceChannel || !conn) return;

        if (dispatcher.paused) {
            dispatcher.resume();
            embedSong
                .setColor(cmdImplemts.colorRadomEx())
                .setDescription("<:play:633088252940648480> Back");
            return channel.send(embedSong);
        }
    },

    stop: (messageProps) => {
        const { voiceChannel, embedSong, message: { channel, author } } = messageProps;

        if (!voiceChannel) return;
        if (!conn) return channel.send(`<:erro:630429351678312506> <@${author.id}> Não estou conectado no canal de voz para conceder essa função`);

        if (speaking) {
            embedSong.setDescription("<:stop:648561120155795466> Stopped");

            dispatcher.destroy();
            speaking = false;
            channel.send(embedSong);
            dispatcher.emit("finish");
        } else {
            return channel.send(`<@${author.id}> <:huuum:648550001298898944> nenhuma música tocando nesse canal!`);
        }
    },

    vol: (messageProps) => {
        const { voiceChannel, args, embedSong, message: { channel, author } } = messageProps;

        if (typeof args != "number" || !args) return;
        if (!voiceChannel || !conn) return;

        let numberVol = parseInt(args[0]);
        let description;

        switch (numberVol) {
            case 0:
                description = "<:silentmode:633076689202839612>";
                break;
            case 1:
                description = "<:lowvolume:633076130626404388>";
                break;
            case 3:
                description = "\🥴  Volume máximo, Não recomendo a altura desse volume";
                break;
            default:
                conn.dispatcher.setVolume(0.5);
                break;
        }
        channel.send(embedSong.setDescription(description));

        return (numberVol >= 0 && numberVol <= 3) ? dispatcher.setVolume(numberVol) : channel.send(`<:erro:630429351678312506> <@${author.id}> Digite um numero de 0 a 2`);
    },

    skip: async (messageProps) => {

    },

    playMusic: async (obj) => {
        const { embedSong, message: { channel }, voiceChannel } = obj;

        if (speaking) {

            songInfo.push({
                title: song.title,
                image: song.image,
                url: song.url,
                timeStamp: song.timestamp
            });

            embedDesc = `**foi adicionado na fila:** \n [${song.title}](${song.url}) `;

            embedSong
                .setDescription(embedDesc)
                .setThumbnail(song.image)
                .setTitle("");

            channel.send(embedSong);

        } else {
            songInfo.push({
                title: song.title,
                image: song.image,
                url: song.url,
                timeStamp: song.timestamp
            });
            title = songInfo[0].title;
            timeStamp = songInfo[0].timeStamp;
            url = songInfo[0].url;
            image = songInfo[0].image;

            dispatcher = await conn.play(ytdl(url), { volume: 0.5 });
            
            conn.on('error', error => conn.disconnect());
        
            conn.on("disconnect", () => (
                speaking = false, 
                songInfo = [],
                conn = null
            ));

            dispatcher.on("error", err => { throw new Error(err) });

            dispatcher.on("start", () => evt.emit("start",{channel}));

            dispatcher.on("finish", () => {
                speaking = false;
                if (voiceChannel.members.size <= 1) return conn.disconnect();
                if (!conn) return;
                if (songInfo.length >= 10) songInfo.shift();
                    evt.emit("finish");
                    evt.emit("start",{channel});
            });
        }
    },
    
    events: () => {
        evt.on("start", data => {
            const {channel} = data;
            speaking = true;

            const embedTitle = "Tocando <a:Ondisco:630470764004638720> \n``" + title + "``";
            const embedDesc = `Duração: ${timeStamp} \n [Video](${url})`;
                embedSong
                    .setDescription(embedDesc)
                    .setTitle(embedTitle)
                    .setThumbnail(image);

                channel.send(embedSong);
        });


        evt.on("finish", () => {
            const values = songInfo.values()
   
            values.next();
            const value = values.next().value;
            if(value)   
                title = value.title;
                timeStamp = value.timeStamp; 
                url = value.url;
                image = value.image;

                dispatcher = conn.play(ytdl(value.url, { volume: 0.5 }));
        })
    }
}

module.exports =  Comands;