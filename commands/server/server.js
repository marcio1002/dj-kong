const implements = require('../../modules/func_implements')

module.exports = {
  name: "server",
  description: "Mostra informações do servidor",
  execute: async ([messageProps, useMessageProps]) => {
    const { embed, message: { channel, author, guild } } = messageProps

        let avatar = guild.splashURL() ?? guild.iconURL()
        let date = guild.createdAt.toLocaleDateString().split("-").reverse().join("-")
        embed
            .setFooter(`${author.username} \t✦\t ${implements.getDate()} ás ${implements.getTimeStamp()}`, author.avatarURL())
            .setColor(implements.colorRadomEx())
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
}