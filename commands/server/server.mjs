import helpers from '../../modules/helpers.mjs'

const command = {
  name: 'server',
  description: 'Mostra informações do servidor',
  execute: async ([messageProps, setMessageProps]) => {
    const { embed, message: { channel, author, guild, createdTimestamp } } = messageProps

        let avatar = guild.splashURL() ?? guild.iconURL()
        let date = guild.createdAt.toLocaleDateString('pt-BR')
        embed
            .setFooter(`${author.username}  ✦  ${helpers.getDate(createdTimestamp)} ás ${helpers.getTimeStamp(createdTimestamp)}`, author.avatarURL())
            .setColor(helpers.colorRadomEx())
            .setTitle(`${guild.name}`)
            .setDescription(`
                **Criado por:** <@${guild.ownerID}>\n
                **ID:** ${guild.id}\n
                **Sigla:** ${guild.nameAcronym}\n
                **Região:** ${guild.region}\n
                **Criado em:** ${date}\n
                **Total de canais:** ${guild.channels.cache.size} canais\n
                **Total de membros:** ${guild.memberCount} membros\n
                **Total de membros premiums:** ${guild.premiumSubscriptionCount} membros premiums\n
                **Servidor com muitos membros:** ${guild.large ? 'sim' : 'não'}\n
                **Servidor verificado** ${guild.verified ? 'sim' : 'não'}\n
                **Nível do prêmio do servidor:** ${guild.premiumTier}\n
            `)
            .setThumbnail(avatar);
        (await channel.send(embed)).delete({ timeout: 55000 })
  }
}

export default command