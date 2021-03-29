
const economy = require('@features/economy')
const maxMin = (max, min) => Math.floor(Math.random() * (max - min + 1)) + min;

//main
module.exports = {
    commands: ['test'],
    expectedArgs: "None",
    permissionError: 'Bạn phải là v4v để có thể sử dụng lệnh này',
    description: "Reaction",
    requiredRoles: ['adventure', 'v4v'],
    callback: async (message, arguments) => {

        const { guild } = message
        const guildId = message.guild.id
        const userId = message.author.id

        economy.addWound(guild, guildId, userId, 1, 1)

    }
}