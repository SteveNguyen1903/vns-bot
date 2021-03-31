const economy = require('@features/economy')
const Discord = require('discord.js');

const getNeededXP = level => level * level * 100
const maxHP = level => level * 20 + 100

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
                { name: 'Thông tin', value: `:yen: Tiền: ${inventory.coins}\n:cross: EXP: ${inventory.xp}/${getNeededXP(inventory.level)} đến **level ${inventory.level + 1}**\n:drop_of_blood: HP: ${inventory.hp}/${maxHP(inventory.level)}` },
                {
                    name: 'Hòm đồ',
                    value: `:coin: Token: ${inventory.items.token}\n:envelope: Letter: ${inventory.items.letter}\n:test_tube: Potion: ${inventory.items.potion}\n`
                })
            .setTimestamp()
            .setFooter('Developed by v4v', 'https://i.imgur.com/pmDv6Hb.png');
        message.channel.send(embed)
    }
}