const ytSearch = require('yt-search');
const func_complements = require("./func_imprements");

module.exports = {

    avatar: (embedSong,message,mentionUser, memberMentions) => {
        const {channel,author,createdTimestamp} = message;
        let avatar;
        let image;
        embedSong.setColor(func_complements.colorRadomEx())
            .setTimestamp(createdTimestamp)
            .setAuthor(author.tag, author.displayAvatarURL)
            .setFooter("Ondisco", "https://camo.githubusercontent.com/81f3e90081ea81f70416bb6ca64181bb291831fc/68747470733a2f2f63646e2e646973636f72646170702e636f6d2f617661746172732f3631373532323130323839353131363335382f39346237656438373565333939663339333130303062626662633666666437642e706e673f73697a653d32303438");
        
            if (mentionUser) {
                avatar = memberMentions.user.displayAvatarURL;
                image = memberMentions.user.displayAvatarURL;

            } else {
                avatar = author.displayAvatarURL;
                image = author.displayAvatarURL;
            }
        embedSong.setDescription(`<:image:633071783414726666>** [Download do avatar](${avatar})**`)
        .setImage(image);

        channel.send(embedSong);
    },

    help: async (embedHelp,channel,createdTimestamp) => {
        embedHelp.setColor("#AD25D7")
            .setTitle("<:que:648555789119914005> **```Help```**")
            .setTimestamp(createdTimestamp)
            .setDescription("Adicione o **``Ondisco``** em outros servidores [Convite](https://discordapp.com/oauth2/authorize?=&client_id=617522102895116358&scope=bot&permissions=8) \n ----------------------------------------------------------")
            .setFooter("Ondisco", "https://camo.githubusercontent.com/81f3e90081ea81f70416bb6ca64181bb291831fc/68747470733a2f2f63646e2e646973636f72646170702e636f6d2f617661746172732f3631373532323130323839353131363335382f39346237656438373565333939663339333130303062626662633666666437642e706e673f73697a653d32303438")
            .addField("``avatar``", "Comando para visualizar o avatar do perfil")
            .addField("<:streamvideo:633071783393755167>", "Comandos para ouvir música")
            .addBlankField()
            .addField("**``play``**", "inicia a música", true)
            .addField("**``leave``**", "Finalizar a música e sai do canal", true)
            .addField("**``back``**", "Continua a música pausada", true)
            .addField("**``pause``**", "Pausa a música", true)
            .addField("**``stop``**", "Finaliza a música", true)
            .addField("**``vol``**", "Aumenta ou diminui o volume.\n **``Min:``** 0   **``Max:``** 4", true)
            .addField("**``skip``**", "pula a música que está tocando no momento", true);

        const m = await channel.send(embedHelp);
        m.delete(35000);
    },

    play: async (voiceChannel,message,arguments,optEmbed) => {
        let option = 1;
        let cont = 1;
        let optionTitle = [];
        const {channel,author} = message;

        if (!voiceChannel) return channel.send(`<:erro:630429351678312506> <@${author.id}> só posso tocar a musicá você estiver conectado em um canal de voz`);
        if (voiceChannel.joinable === false || voiceChannel.speakable === false) return channel.send(`<:alert:630429039785410562> <@${author.id}> Não tenho permissão para ingressar ou enviar audio nesse canal.`);
        if (voiceChannel.muted) return channel.send(`<@${author.id}>  não posso enviar audio nesse canal de voz, canal de voz mudo.`);
        if (!voiceChannel.memberPermissions(author.id)) return;
        const memberPermission = voiceChannel.memberPermissions(author.id);
        if (!memberPermission.has("CONNECT") || !memberPermission.has("ADMINISTRATOR")) return channel.send(`<@${author.id}> Você não tem permissão para conectar nesse canal de voz`);
        if(arguments.length == 0) return channel.send("<@" + author.id + "> Digite o nome da musica que deseja tocar. \n exe: ``!dplay Eminem Sing For The Moment `` ");
        
        ytSearch(arguments.join(" "), async function (err, videoInfo) { 
            const listVideos = videoInfo.videos;
            
            optEmbed
                .setColor("#A331B6")
                .setTitle("Selecione a musica que deseja tocar digitando um numero entre ``1`` a ``10``");

            for (const video of listVideos) {
                optionTitle.push("** " + option + "** ->  <:streamvideo:633071783393755167> **``" + video['title'] + "``** \n");
                option += 1;
                if (cont === 10) break
                cont += 1;
            }

            optEmbed.setDescription(optionTitle);
            const msg = await message.reply(optEmbed);
            msg.delete(40000);

            const filter = res => res.author.id === author.id;

            channel.awaitMessages(filter, { max: 1, time: 40000 })
                .then(async sellect => {
                    if (sellect.first().content === "cancel") return channel.send("Música cancelada");

                    let op = await func_complements.selectOption(sellect.first().content);
                    let song = listVideos[op];

                    if (!song) return;

                    voiceChannel.join()
                        .then(connection => {
                            func_complements.playMusic(voiceChannel,connection, song,message,optEmbed);
                        });
                })
                .catch(console.error);
        });
    },

    leave: (voiceChannel,message,embedSong) => {
        const {channel,author} = message;

        if (!voiceChannel) return channel.send(` <:erro:630429351678312506> Desculpe <@${author.id}> , não posso sair do canal de voz você está ausente.`);
        if (!voiceChannel.connection) return
        embedSong.setTitle("Desconectado do canal ``" + voiceChannel.name + "``")
        voiceChannel.connection.disconnect();
        channel.send(embedSong);
    },

    pause: (voiceChannel,message,embedSong) => {
        const {channel,author} = message;

        if (!voiceChannel) return channel.send(` <:erro:630429351678312506> Desculpe <@${author.id}> , não posso pausar a musica você está ausente no canal de voz`);
        if (!voiceChannel.connection) return channel.send(`<:erro:630429351678312506> <@${author.id}> Não estou conectado no canal de voz para conceder essa função`);
        embedSong.setColor(func_complements.colorRadomEx())
            .setDescription("<:pause:633071783465058334> paused");
        if (voiceChannel.connection.speaking) {
            voiceChannel.connection.dispatcher.pause();
            channel.send(embedSong);
        } else {
            return channel.send(`<@${author.id}>  <:huuum:648550001298898944> nenhuma musica tocando nesse canal!`);
        }
    },

    back: (voiceChannel,message,embedSong) => {
        const {channel,author} = message;

        if (!voiceChannel.connection) return channel.send(`<:erro:630429351678312506> <@${author.id}> Não estou conectado no canal de voz para conceder essa função`);
        if (!voiceChannel) return;
        embedSong.setDescription("<:play:633088252940648480> ")
            .setColor(func_complements.colorRadomEx());
        if (voiceChannel.connection.dispatcher.paused) {
            voiceChannel.connection.dispatcher.resume();
            return channel.send(embedSong);
        }
    },

    stop: (voiceChannel,message,embedSong) => {
        const {channel,author} = message;

        if (!voiceChannel.connection) return channel.send(`<:erro:630429351678312506> <@${author.id}> Não estou conectado no canal de voz para conceder essa função`);
        if (!voiceChannel) return;
        embedSong.setDescription("<:stop:648561120155795466> stopped");
        if (voiceChannel.connection.speaking) {
            voiceChannel.connection.dispatcher.end();
            return channel.send(embedSong);
        } else {
            return channel.send(`<@${author.id}> <:huuum:648550001298898944> nenhuma musica tocando nesse canal!`);
        }
    },

    vol: (voiceChannel,message,arguments,embedSong) => {
        const {channel,author} = message;
        if( typeof arguments == "number" || !arguments) return;
        if (!voiceChannel ||!voiceChannel.connection) return;
        let numberVol = parseInt(arguments[0]);
        let description;

        embedSong.setColor(func_complements.colorRadomEx());


        switch (numberVol) {
            case 0:
                description = "<:silentmode:633076689202839612>";
                break;
            case 1:
                description = "<:lowvolume:633076130626404388>";
                break;
            case 3:
                description = "<:mediumvolume:633076130668085248>";
                break;
            case 4:
                description = "\🥴  Volume máximo, Não recomendo a altura desse volume";
                break;
            default:
                voiceChannel.connection.dispatcher.setVolume(1);
                break;
        }
            channel.send(embedSong.setDescription(description));
        return (numberVol >= 0 && numberVol <= 4) ? voiceChannel.connection.dispatcher.setVolume(numberVol) : channel.send(`<:erro:630429351678312506> <@${author.id}> Digite um numero de 0 a 4`);
    },

    skip: async (voiceChannel,message,embedSong) => {
        const {channel, author,} = message;

        if (!voiceChannel.connection) return channel.send(`<:erro:630429351678312506> <@${author.id}> Não estou conectado no canal de voz para conceder essa função`);
        if (!voiceChannel) return;

        const { receivers } = voiceChannel.connection;
        if (!receivers[0]) return;
        const dispatcher = await voiceChannel.connection.playStream(ytdl(receivers[0]));
        embedSong.setTitle("música pulada");
        channel.send(embedSong);

        dispatcher.stream.on("end", () => {
            if (voiceChannel.members.size <= 1) voiceChannel.connection.disconnect();
            receivers.shift();
            if (!receivers[0]) return;
            voiceChannel.connection.playStream(ytdl(receivers[0]));
        });
    }
}