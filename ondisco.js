const discord = require("discord.js");
const bot = new discord.Client();
const config = require("./config.json");
const express = require("express");
const port = process.env.PORT || 23011;
const token = process.env.TOKEN || config.token;
const prefix = process.env.PREFIX || config.prefix;
const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');

bot.on("ready", () => {
    console.log(`Bot Online, com ${bot.users.size} usuários, ${bot.channels.size} canais e ${bot.guilds.size} servidores.`);
});

bot.on("presenceUpdate", async () => {
    bot.user.setActivity('Digite !dhelp para mais informações.');
});
bot.on("guildCreate", guild => {
    console.log(`O bot entrou  no servidor: ${guild.name} (id ${guild.id}). população: ${guild.memberCount} membros.`);
    bot.user.setActivity(`Estou em ${bot.guilds.size} servidores`);
});
bot.on("guildDelete", guild => {
    console.log(`O bot foi removido do servidor: ${guild.name} \nid: ${guild.id}`);
});
bot.on("guildMemberAdd", async newmember => {
    canal = bot.channels.get('622940693022638090');
    guild = bot.guilds.get('565566718446141450');
    if (newmember.guild !== guild) return;
    if (newmember.user === bot.user.bot) return;

    let embed = new discord.RichEmbed();
    embed.setTitle(newmember.user.tag)
        .setColor("#FFF100")
        .setTimestamp(canal.createdTimestamp)
        .setThumbnail(newmember.user.displayAvatarURL)
        .setDescription("**Você entrou no servidor:** **``" + newmember.guild.name + "``** \n**Com você temos:** **``" + newmember.guild.memberCount + "`` membros 🥳**")
        .setImage("https://cdn.dribbble.com/users/1029769/screenshots/3430845/hypeguy_dribbble.gif")
        .setFooter("Ondisco", "https://cdn.discordapp.com/app-icons/617522102895116358/eb1d3acbd2f4c4697a6d8e0782c8673c.png?size=256");

    canal.send(` Bem vindo(a) !  \\😃  <@${newmember.user.id}>`, embed);
});
bot.on('message', async message => {
    if (message.author.bot) return;
    if (message.channel.type === "dm") return;
    if (message.content === "<@!617522102895116358>" || message.content === "<@617522102895116358>") {
        const embedmsg = new discord.RichEmbed();
        embedmsg.setTitle(`Olá ${message.author.username}! \nMeu nome é Ondisco logo a baixo tem minha descrição:`)
            .setDescription("**prefixo:** **``!d``** \n **função do Ondisco:** **``Divertir os usuarios do Discord tocando músicas nos canais de voz``** \n **Criador do Ondisco:** **``Marcio#1506``**")
            .setColor('#B955D4')
            .setTimestamp(message.createdTimestamp)
            .setFooter("Ondisco", "https://cdn.discordapp.com/app-icons/617522102895116358/eb1d3acbd2f4c4697a6d8e0782c8673c.png?size=256");
        message.channel.send(embedmsg);
    }
    if (!message.content.startsWith(prefix)) return;
    const mentionUser = message.mentions.users.first();
    const memberMentions = message.guild.member(mentionUser);
    const arguments = message.content.split(' ');
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const comando = args.shift().toLowerCase();
    const embedSong = new discord.RichEmbed()
        .setColor("#A331B6");
    let op;
    let SongPlayed = [];
    const { author, createdTimestamp, channel, member: { voiceChannel } } = message;

    switch (comando) {
        case "avatar":
            embedSong.setColor(colorRadomEx())
                .setTimestamp(createdTimestamp)
                .setAuthor(author.tag, author.displayAvatarURL)
                .setFooter("Ondisco", "https://cdn.discordapp.com/app-icons/617522102895116358/eb1d3acbd2f4c4697a6d8e0782c8673c.png?size=256");
            if (mentionUser) {
                embedSong.setDescription(`<:image:633071783414726666>** [Download do avatar](${memberMentions.user.displayAvatarURL})**`)
                    .setImage(memberMentions.user.displayAvatarURL)

            } else {
                embedSong.setDescription(`<:image:633071783414726666>** [Download do avatar](${author.displayAvatarURL})**`)
                    .setImage(author.displayAvatarURL)
            }
            channel.send(embedSong);
            break;
        case "help":
            const embedHelp = new discord.RichEmbed();
            embedHelp.setColor("#AD25D7")
                .setTitle("<:que:648555789119914005> **```Help```**")
                .setTimestamp(createdTimestamp)
                .setDescription("Adicione o **``Ondisco``** em outros servidores [Convite](https://discordapp.com/oauth2/authorize?=&client_id=617522102895116358&scope=bot&permissions=8) \n ----------------------------------------------------------")
                .setFooter("Ondisco", "https://cdn.discordapp.com/app-icons/617522102895116358/eb1d3acbd2f4c4697a6d8e0782c8673c.png?size=256")
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
            break;
        case "play":
            if (!voiceChannel) return channel.send(`<:erro:630429351678312506> <@${author.id}> só posso iniciar você estiver conectado em um canal de voz`);
            if (voiceChannel.joinable === false || voiceChannel.speakable === false) return channel.send(`<:alert:630429039785410562> <@${author.id}> Não tenho permissão para ingressar ou enviar audio nesse canal.`);
            if (voiceChannel.muted) return channel.send(`<@${author.id}>  não posso enviar audio nesse canal de voz, canal de voz mudo.`);
            if (!voiceChannel.memberPermissions(author.id)) return;
            const memberPermission = voiceChannel.memberPermissions(author.id);
            if (!memberPermission.has("CONNECT") || !memberPermission.has("ADMINISTRATOR")) return channel.send(`<@${author.id}> Você não tem permissão para conectar nesse canal de voz`);

            arguments.shift();
            ytSearch(arguments.join(" "), async function (err, videoInfo) {
                if (!videoInfo) return channel.send("<@" + author.id + "> Digite o nome da musica que deseja tocar. \n exe: ``!dplay Eminem Sing For The Moment `` ");
                if (err) console.log(err);

                const listVideos = videoInfo.videos;
                let option = 1;
                let cont = 1;
                let optionTitle = [];

                const optEmbed = new discord.RichEmbed()
                    .setColor("#A331B6");
                optEmbed.setTitle("Selecione a musica que deseja tocar digitando um numero entre ``1`` a ``10``");

                for (const video of listVideos) {
                    optionTitle.push("** " + option + "** ->  <:streamvideo:633071783393755167> **``" + video['title'] + "``** \n");
                    option = option + 1;
                    if (cont === 10) break
                    cont = cont + 1;
                }

                optEmbed.setDescription(optionTitle);
                const msg = await message.reply(optEmbed);
                msg.delete(40000);

                const filter = respon => respon.author.id === author.id;

                channel.awaitMessages(filter, {
                    max: 1,
                    time: 40000
                })
                    .then(async sellect => {
                        if (sellect.first().content === "cancel") return channel.send("Música cancelada");
                        await selectOption(sellect.first().content);
                        let song = listVideos[op];
                        if (!song) return;
                        const voiceConnection = voiceChannel.join();

                        voiceConnection.then(connection => {
                            playMusic(connection,song);
                        });
                    })
                    .catch(console.error);
            });
            break;
        case "leave":
            if (!voiceChannel.connection) return channel.send(`<@${author.id}>, <:huuum:648550001298898944> não posso sair do canal de voz ,se eu não estou nele.`);
            if (!voiceChannel) return channel.send(` <:erro:630429351678312506> Desculpe <@${author.id}> , não posso sair do canal de voz você está ausente.`);
            embedSong.setTitle("Desconectado do canal ``" + voiceChannel.name + "``")
            voiceChannel.connection.disconnect();
            channel.send(embedSong);
            break;

        case "pause":
            if (!voiceChannel.connection) return channel.send(`<:erro:630429351678312506> <@${author.id}> Não estou conectado no canal de voz para conceder essa função`);
            if (!voiceChannel) return channel.send(` <:erro:630429351678312506> Desculpe <@${author.id}> , não posso pausar a musica você está ausente no canal de voz`);
            embedSong.setColor(colorRadomEx());
            embedSong.setDescription("<:pause:633071783465058334> paused");
            if (voiceChannel.connection.speaking) {
                voiceChannel.connection.dispatcher.pause();
                channel.send(embedSong);
            } else {
                return channel.send(`<@${author.id}>  <:huuum:648550001298898944> nenhuma musica tocando nesse canal!`);
            }
            break;

        case "back":
            if (!voiceChannel.connection) return channel.send(`<:erro:630429351678312506> <@${author.id}> Não estou conectado no canal de voz para conceder essa função`);
            if (!voiceChannel) return;
            embedSong.setDescription("<:play:633088252940648480> ")
                .setColor(colorRadomEx());
            if (voiceChannel.connection.dispatcher.paused) {
                voiceChannel.connection.dispatcher.resume();
                return channel.send(embedSong);
            }
            break;
        case "stop":
            if (!voiceChannel.connection) return channel.send(`<:erro:630429351678312506> <@${author.id}> Não estou conectado no canal de voz para conceder essa função`);
            if (!voiceChannel) return;
            embedSong.setDescription("<:stop:648561120155795466> stopped");
            if (voiceChannel.connection.speaking) {
                voiceChannel.connection.dispatcher.end();
                return channel.send(embedSong);
            } else {
                return channel.send(`<@${author.id}> <:huuum:648550001298898944> nenhuma musica tocando nesse canal!`);
            }

        case "vol":
            let numberVol = parseInt(arguments[1]);
            embedSong.setColor(colorRadomEx());

            if (!voiceChannel || !numberVol || !voiceChannel.connection) return;

            switch (numberVol) {
                case 0:
                    embedSong.setDescription("<:silentmode:633076689202839612>");
                    channel.send(embedSong);
                    break;
                case 1:
                    embedSong.setDescription("<:lowvolume:633076130626404388>");
                    channel.send(embedSong);
                    break;
                case 3:
                    embedSong.setDescription("<:mediumvolume:633076130668085248>");
                    channel.send(embedSong);
                    break;
                case 4:
                    embedSong.setDescription("\🥴  Volume máximo, Não recomendo a altura desse volume");
                    channel.send(embedSong);
                    break;
                default:
                    voiceChannel.connection.dispatcher.setVolume(1);
                    break;
            }
            return (numberVol >= 0 && numberVol <= 4) ? voiceChannel.connection.dispatcher.setVolume(numberVol) : channel.send(`<:erro:630429351678312506> <@${author.id}> Digite um numero de 0 a 4`);

        case "skip":
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
            break;
           async function playMusic(connection, song) {
                const videoUrl = song['url'];
                const videoTitle = song['title'];
                embedSong.setThumbnail(song['image']);
                if (connection.dispatcher) {
                    connection.receivers.push(videoUrl);
                    
                    embedSong.setDescription(`**foi adicionado na fila:** \n [${videoTitle}](${videoUrl}) `);
                    channel.send(embedSong);
                } else {
                    connection.receivers.push(videoUrl);
                    const dispatcher = await connection.playStream(ytdl(connection.receivers[0]));
                    dispatcher.on("start", () => {
                        embedSong.setTitle('Tocando <a:Ondisco:630470764004638720> ``'+ videoTitle +'``')
                            .setDescription(`Duração: ${song["timestamp"]} \n [Video](${videoUrl})`);
                        channel.send(embedSong);
                    });
                    dispatcher.stream.on("end", () => {
                        if (voiceChannel.members.size <= 1) connection.disconnect();
                        if (connection.speaking) {
                            connection.receivers.push(videoUrl);
                            embedSong.setDescription(`**foi adicionado na fila:** \n [${videoTitle}](${videoUrl}) `);
                            channel.send(embedSong);
                        } else {
                            music = connection.receivers[0];
                            connection.receivers.shift();
                            if (!connection.receivers[0]) return;
                            connection.playStream(ytdl(connection.receivers[0]));
                        }
                    });
                    connection.dispatcher.stream.on('error', error => console.log(error));
                }
            }
    }
    function colorRadomEx() {
        let letters = "123456789ABCDEFGH";
        color = "#";
        for (let c = 0; c < 6; c++) {
            color += letters[Math.floor(Math.random() * 12)];
        }
        return color;
    }
    function selectOption(arg) {
        const numbers = "12345678910";
        if (!arg || arg.length === 0) return channel.send(`Nenhuma opção escolhida`);
        if (arg.length > 2) return console.log(`O tamanho do caractere foi excedido pra :${arg.length} caracteres`);
        if (!numbers.includes(arg)) return console.log("Só é aceito números");
        const option = Number(arg) - 1;
        op = option;
    }
});
bot.on('error', console.error);
express().listen(port);
bot.login(token);