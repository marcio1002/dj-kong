const discord = require("discord.js");
const bot = new discord.Client();
const config = require("./config.json");
const express = require("express");
const comands = require("./comands");
const port = process.env.PORT || 5454;
const token = (config.token)? config.token : process.env.TOKEN;
const prefix = (config.prefix)? config.prefix : process.env.PREFIX ;





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
    const req = args.shift().toLowerCase();
    
    const optEmbed = new discord.RichEmbed();
    const embedHelp = new discord.RichEmbed();
    const embedSong = new discord.RichEmbed()
        .setColor("#A331B6");

    const { createdTimestamp, channel, member: { voiceChannel } } = message;

    const func_comands = {

        "avatar": () => comands.avatar(embedSong,message,mentionUser,memberMentions),

        "help": () => comands.help(embedHelp,channel,createdTimestamp),

        "play": () => comands.play(voiceChannel,message,args,optEmbed),

        "leave": () => comands.leave(voiceChannel,message,embedSong),

        "pause": () => comands.pause(voiceChannel,message,embedSong),

        "back": () => comands.back(voiceChannel,message,embedSong),

        "stop": () => comands.stop(voiceChannel,message,embedSong),

        "vol": () => comands.vol(voiceChannel,message,args,embedSong),

        "skip": () => comands.skip(voiceChannel,message,embedSong)
    }
    
    if (func_comands[req]) func_comands[req]();
});
//bot.on('error', console.error);
express().listen(port);
bot.login(token);