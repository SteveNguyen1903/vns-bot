module.exports = {
    commands: 'removerole',
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

        if (member.roles.cache.get(role.id)) {
            member.roles.remove(role)
            message.reply(`That user no longer has the role ${roleName}`)
        } else {
            message.reply(`That user does not have the role ${roleName}`)
        }
    }
}