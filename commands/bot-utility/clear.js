module.exports = {
    commands: ['clear'],
    expectedArgs: 'string',
    permissionError: 'Bạn cần phải là v4v để thực hiện lệnh này',
    minArgs: 0,
    maxArgs: null,
    callback: (client, message, arguments, text) => {
        if (message.member.hasPermission('ADMINISTRATION')) {
            message.channel.messages.fetch().then((results) => {
                message.channel.bulkDelete(14, true)
            })
        }
    },
    permissions: 'ADMINISTRATOR',
}