const economy = require('@features/economy')


module.exports = {
    commands: ['balance', 'bal'],
    maxArgs: 1,
    description: "Check balance",
    expectedArgs: "@ ai đó hoặc để trống",
    callback: async (message, arguments, text) => {
        const target = message.mentions.users.first() || message.author
        const targetId = target.id

        const guildId = message.guild.id
        const userId = target.id

        const coins = await economy.getCoins(guildId, userId)

        message.reply(`Bãn đã thêm số tiền ${coins} thành công!`)
    }
}