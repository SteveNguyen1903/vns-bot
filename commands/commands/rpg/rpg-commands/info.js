const economy = require('@features/economy')
const Discord = require('discord.js');

module.exports = {
    commands: ['info'],
    expectedArgs: "Rỗng",
    permissionError: 'Bạn phải là adventure để sử dụng lệnh này',
    description: "Hòm đồ",
    requiredRoles: ['adventure'],
    cooldown: 5,
    callback: async (message) => {

        const guildId = message.guild.id
        const userId = message.author.id

        const inventory = await economy.showProfile(guildId, userId)

        const embed = new Discord.MessageEmbed()
            .setColor(`#b5b5b5`)
            .setTitle(`Thế giới Leidenschaftlich`)
            // .setURL('https://discord.js.org/')
            // .setAuthor('Some name', 'https://i.imgur.com/wSTFkRM.png', 'https://discord.js.org')
            .setDescription(`Hồ sơ hành gia <@${userId}>`)
            .setThumbnail(`${message.author.displayAvatarURL()}`)
            .addFields(
                { name: 'Thông tin', value: `:yen: Tiền: ${inventory.coins}` },
                { name: 'EXP', value: `:cross: EXP: 200/500 đến level 2` },
                {
                    name: 'Hòm đồ',
                    value: `:coin: Token: ${inventory.items.token}\n:envelope: Letter: ${inventory.items.letter}\n:test_tube: Potion: ${inventory.items.potion}\n`
                })
            .setTimestamp()
            .setFooter('Developed by v4v', 'https://i.imgur.com/pmDv6Hb.png');
        message.channel.send(embed)

    }
}