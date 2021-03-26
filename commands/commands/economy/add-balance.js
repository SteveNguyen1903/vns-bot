const economy = require('@features/economy')

module.exports = {
    commands: ['addbalance', 'addbal'],
    minArgs: 2,
    maxArgs: 2,
    expectedArgs: "<The target's @> <coin amount>",
    permissionError: 'You must be an admin to use this command',
    description: "Add balance",
    permissions: 'ADMINISTRATOR',
    callback: async (message, arguments) => {
        const mention = message.mentions.users.first()

        if (!mention) {
            message.reply('Tag ai đó để thêm tiền')
            return
        }

        const coins = arguments[1]
        if (isNaN(coins)) {
            message.reply('Đúng số tiền cần cho')
        }

        const guildId = message.guild.id
        const userId = mention.id

        const newCoins = await economy.addCoins(guildId, userId, coins)

        message.reply(`Bạn đã cho <@${userId}> $${coins}. Số tiền của họ là $${newCoins}`)
    }
}