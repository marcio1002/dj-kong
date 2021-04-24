import helpers from '../../utils/helpers.mjs'

const command = {
  name: 'servericon',
  description: 'Mostra o icon/imagem do servidor',
  exemple: `\n**Como usar:**\n\`\`\`${PREFIX}srvicon\`\`\``,
  execute: async ([{ embed, message: { channel, author, guild, createdTimestamp } },]) => {

        let avatar = guild.splashURL({ size: 1024, dynamic: true }) ??  guild.iconURL({ size: 1024, dynamic: true })
        let banner = guild.bannerURL({ size: 1024, dynamic: true }) ?? guild.discoverySplashURL({ size: 1024, dynamic: true })

        embed
            .setColor(helpers.colorRadomEx())
            .setTitle(`${guild.name}`)
            .setThumbnail(banner)
            .setImage(avatar)
            .setDescription(`<:image:633071783414726666>** [Baixar ícone do servidor ${guild.name}](${avatar})**`)
            .setFooter(`${author.username}  ✦  ${helpers.getDate(createdTimestamp)} ás ${helpers.getTimeStamp(createdTimestamp)}`, author.avatarURL());

        (await channel.send(embed)).delete({ timeout: 55000 })
  }
}

export default command