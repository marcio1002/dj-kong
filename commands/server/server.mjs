import helpers from '../../utils/helpers.mjs'

const command = {
  name: 'server',
  description: 'Mostra informações do servidor',
  exemple: `\n**Como usar:**\n\`\`\`${PREFIX}server\`\`\``,
  execute: async ([{ embed, message: { channel, author, guild, createdTimestamp } },]) => {

        let avatar = guild.splashURL() ?? guild.iconURL()

        embed
            .setColor(helpers.colorRadomEx())
            .setTitle(`${guild.name}`)
            .setThumbnail(avatar)
            .addFields(
              { name: '🛠 **Criado por:**', value: guild.owner.user.tag, inline: false },
              { name: '🧾 **ID do servidor:**', value: guild.id, inline: false },
              { name: '📝 **Sigla:**', value: guild.nameAcronym, inline: false },
              { name: '🗺 **Região:**', value: guild.region, inline: false },
              { name: '🗓 **Criado em:**', value: helpers.getDate(guild.createdAt), inline: false },
              { name: '📂 **Total de canais:**', value: `${guild.channels.cache.size} canais`, inline: false },
              { name: '👥 **Total de membros:**', value: `${guild.memberCount} membros`, inline: false },
              { name: '🗄 **Quant. máxima de membros:**', value: `${guild.maximumMembers} membros`, inline: false },
              { name: '🎖 **Total de membros premiums:**', value: `${guild.premiumSubscriptionCount} membros premiums`, inline: false },
              { name: '🛡 **Servidor verificado:**', value: guild.verified ? 'sim' : 'não', inline: false },
              { name: '🏅 **Nível do prêmio do servidor:**', value:  guild.premiumTier, inline: false }
            )
            .setFooter(`${author.username}  ✦  ${helpers.getDate(createdTimestamp)} ás ${helpers.getTimeStamp(createdTimestamp)}`, author.avatarURL());

        (await channel.send(embed)).delete({ timeout: 55000 })
  }
}

export default command