import helpers from '../../modules/helpers.mjs'

const command = {
    name: "avatar",
    description: "Visualiza o avatar do usuário.",
    execute: ([messageProps,]) => {
        const { embed, mentionUser, memberMentions, message: { channel, author } } = messageProps
        let avatar

        embed
            .setFooter(`${author.username} ✦ ${helpers.getDate()} ás ${helpers.getTimeStamp()}`, author.avatarURL())
            .setColor(helpers.colorRadomEx())

        if (mentionUser)
            avatar = memberMentions.user.displayAvatarURL({ size: 1024, dynamic: true })
        else
            avatar = author.displayAvatarURL({ size: 1024, dynamic: true })

        embed
            .setDescription(`<:image:633071783414726666>** [Baixar avatar](${avatar})**`)
            .setImage(avatar)

        channel.send(embed)
    }
}

export default command