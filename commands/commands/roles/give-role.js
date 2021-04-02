module.exports = {
    commands: 'giverole',
    minArgs: 2,
    expectedArgs: "<Target user's @>",
    permission: 'ADMINISTRATOR',
    callback: (message, arguments) => {
        const targetUser = message.mentions.users.first()
        if (!targetUser) return message.reply('Please specify someone to give a role to')

        arguments.shift()

        const roleName = arguments.join(' ')
        const { guild } = message

        const role = guild.roles.cache.find((role) => {
            return role.name === roleName
        })

        if (!role) return message.reply(`There's no role with the name ${roleName}`)

        const member = guild.members.cache.get(targetUser.id)
        member.roles.add(role)
        message.reply(`That user now has the ${roleName}`)
    }
}