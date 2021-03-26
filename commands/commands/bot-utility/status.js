module.exports = {
    commands: ['status'],
    expectedArgs: 'string',
    permissionError: 'Bạn cần phải là v4v để thực hiện lệnh này',
    minArgs: 1,
    description: 'Set status',
    maxArgs: 1,
    callback: (message, arguments, text) => {
        const content = message.content.replace('!pstatus ', '')
        // client.user.setPresence({
        //     activity: {
        //         name: content,
        //         type: 0
        //     }
        // })
    },
    permissions: 'ADMINISTRATOR',
}