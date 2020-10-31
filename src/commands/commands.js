const cmdImplemts = require("./func_imprements")
const cmdMusic = require("./commandsMusic")
const cmdDown = require("./commandsDownload")
const prefix = require("../../config.json").prefix

module.exports = Commands = {

    findCommand(method, props) {
        if (!this[method] || typeof this[method] != "function") return
        this[method](props)
    },

    avatar(messageProps) {
        const { embed, mentionUser, memberMentions, message: { channel, author } } = messageProps
        let avatar
        embed
            .setFooter(`${author.username} \t✦\t ${cmdImplemts.getDate()} ás ${cmdImplemts.getTimeStamp()}`, author.avatarURL())
            .setColor(cmdImplemts.colorRadomEx())

        if (mentionUser)
            avatar = memberMentions.user.displayAvatarURL({ size: 1024, dynamic: true })
        else
            avatar = author.displayAvatarURL({ size: 1024, dynamic: true })

        embed
            .setDescription(`<:image:633071783414726666>** [Baixar avatar](${avatar})**`)
            .setImage(avatar)

        channel.send(embed)
    },

    async serve(messageProps) {
        const { embed, message: { channel, author, guild } } = messageProps
        let avatar = guild.splashURL() || guild.iconURL()
        let date = guild.createdAt.toLocaleDateString().split("-").reverse().join("-")
        embed
            .setFooter(`${author.username} \t✦\t ${cmdImplemts.getDate()} ás ${cmdImplemts.getTimeStamp()}`, author.avatarURL())
            .setColor(cmdImplemts.colorRadomEx())
            .setTitle(`${guild.name}`)
            .setDescription(`
                **Criador por:** <@${guild.ownerID}>\n
                **ID:** ${guild.id}\n
                **Sigla:** ${guild.nameAcronym}\n
                **Região:** ${guild.region}\n
                **Criado em:** ${date}\n
                **Total de canais:** ${guild.channels.cache.size} canais\n
                **Total de membros:** ${guild.memberCount} membros\n
                **Total de membros premiums:** ${guild.premiumSubscriptionCount} membros premiums\n
                **Servidor com muitos membros:** ${guild.large ? "sim" : "não"}\n
                **Servidor verificado** ${guild.verified ? "sim" : "não"}\n
                **Nível do prêmio do servidor:** ${guild.premiumTier}\n
            `)
            .setThumbnail(avatar);
        (await channel.send(embed)).delete({ timeout: 55000 })
    },

    async help(messageProps) {
        const {embed, message: { channel, author }, bot: {user} } = messageProps

        embed
            .setTitle("<:que:648555789119914005> **```Help```**")
            .setDescription("Adicione o **``"+ user.username +"``** em outros servidores [Convite](https://discordapp.com/oauth2/authorize?=&client_id=617522102895116358&scope=bot&permissions=8) \n\n **``Prefixo:``** " + prefix)
            .addField("<:music:648556667364966400> Comandos", "━━━━━━━━━━━━━━", false)
            .addFields(
                { name: "``avatar``", value: "Visualizar e baixar o avatar do perfil", inline: true },
                { name: "``serve``", value: "Descrição do servidor", inline: true },
                { name: "``emj``", value: "Envia ao canal o emoji animado ou emoji personalizado, também envia emoji de outros servidores em que  o bot está.", inline: true },
                { name: "**``Comandos streaming``**", value: "━━━━━━━━━━━━━━━", inline: false },
                { name: "**``play``**", value: "inicia a música", inline: true },
                { name: "**``leave``**", value: "Finalizar a música e sai do canal", inline: true },
                { name: "**``pause``**", value: "Pausa a música", inline: true },
                { name: "**``unpause``**", value: "Continua a música pausada", inline: true },
                { name: "**``stop``**", value: "Finaliza a música", inline: true },
                { name: "**``vol``**", value: "Aumenta ou diminui o volume.\n **``Min:``** 0   **``Max:``** 3", inline: true },
                { name: "**``skip``**", value: "pula a música que está tocando no momento", inline: true },
                { name: "**``replay``**", value: "Toca a música anterior", inline: true },
                { name: "**``list``**", value: "Lista as músicas em espera", inline: true },
                { name: "**``OBS:``**", value: "Você pode cancelar na seleção das música digitando ``cancel``", inline: false },
            )
            .setFooter(`${author.username} \t✦\t${cmdImplemts.getDate()} ás ${cmdImplemts.getTimeStamp()}`, author.avatarURL());

        (await channel.send(embed)).delete({ timeout: 55000 })
    },

    emj(messageProps) {
        const {bot, args, message: {channel, guild} } = messageProps
        
        if(!args || args.length == 0) return channel.send('Digite o nome do emoji exem ``!dreact :emoji:``')
       
        const filter = emoji => emoji.name == args[0].match(/\w+[^\:\\;]/)
        let guildsEmoji
        
        let emoji = guild.emojis.cache.find(filter) || guild.emojis.cache.get(args[0])

        bot.guilds.cache.find(guild => {
            const { emojis } = guild
            return (guildsEmoji =  emojis.cache.find(filter) || emojis.cache.get(args[0]))
        })

        messageProps.message.delete({time: 500})

        if(emoji) 
            channel.send(emoji.animated ? `<a:${emoji.name}:${emoji.id}>` : `<:${emoji.name}:${emoji.id}>`)
        else if(guildsEmoji)
            channel.send(guildsEmoji.animated ? `<a:${guildsEmoji.name}:${guildsEmoji.id}>` : `<:${guildsEmoji.name}:${guildsEmoji.id}>`)
    },

    emjinfo(messageProps) {
        const { args, message: {channel, guild} } = messageProps

        if(!args || args.length == 0) return channel.send('Digite o nome do emoji exem ``!dreact :emoji:``')
        const emoji = guild.emojis.cache.find(emoji => emoji.name == args[0].match(/\w+[^\:\\;]/) || emoji.name == args[0].replace(/\w\d\S/g,'\$1'))

        
        messageProps.message.delete({time: 500})
        if(emoji) channel.send(`Nome: ${emoji.name}\n Id: ${emoji.id}`)
    },

    play(messageProps) {
        cmdMusic.play(messageProps)
    },

    leave(messageProps) {
        cmdMusic.leave(messageProps)
    },

    pause(messageProps) {
        cmdMusic.pause(messageProps)
    },

    unpause(messageProps) {
        cmdMusic.unpause(messageProps)
    },

    vol(messageProps) {
        cmdMusic.vol(messageProps)
    },

    skip(messageProps) {
        cmdMusic.skip(messageProps)
    },

    replay(messageProps) {
        cmdMusic.replay(messageProps)
    },

    list(messageProps) {
        cmdMusic.list(messageProps)
    },

    down(messageProps) {
        cmdDown.down(messageProps)
    }
}