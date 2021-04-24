import helpers from '../../utils/helpers.mjs'

const command = {
    name: 'avatar',
    description: 'Mostra o avatar do perfil.',
    exemple:`\n**Como usar:**\n\`\`\`${PREFIX}avatar\n${PREFIX}avatar @nickName\`\`\``,
    execute: ([messageProps,]) => {
        const { embed, mentionUser, memberMentions, message: { channel, author, createdTimestamp } } = messageProps
        let avatar

        embed
            .setFooter(`${author.username} ✦ ${helpers.getDate(createdTimestamp)} ás ${helpers.getTimeStamp(createdTimestamp)}`, author.avatarURL({size: 32, dynamic: true}))
            .setColor(helpers.colorRadomEx())

        if (mentionUser)
            avatar = memberMentions.user.displayAvatarURL({ size: 1024, dynamic: true })
        else
            avatar = author.displayAvatarURL({ size: 1024, dynamic: true })

        embed
            .setDescription(`<:image:633071783414726666> **${memberMentions?.user?.username ?? author.username}**`)
            .setImage(avatar)

        channel.send(embed)
    }
}

export default command