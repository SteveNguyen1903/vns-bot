const economy = require('@features/economy')
const hp = require('@features/hp')
const defaultItem = require('@root/json/rpg.json')
const Discord = require('discord.js');
const woundSchema = require('@schema/wound-schema')
//check if item exists
const itemCheck = (itemName) => {
    // const result = defaultItem.items.includes(item);
    let result = {}
    defaultItem.items.forEach(item => {
        if (item.name === itemName) {
            result = item
        }
    })
    return result
}

module.exports = {
    commands: ['use'],
    minArgs: 1,
    maxArgs: 1,
    expectedArgs: "<tên món đồ>",
    permissionError: 'Bạn phải là adventure để sử dụng lệnh này',
    description: "Mua đồ trong shop",
    requiredRoles: ['adventure'],
    cooldown: 5,
    // eslint-disable-next-line no-shadow-restricted-names
    callback: async (message, arguments) => {

        let item = itemCheck(arguments[0])
        const guildId = message.guild.id
        const userId = message.author.id
        const inventory = await economy.showProfile(guildId, userId)
        // console.log('item ', item)

        if (!item.name || item.name === String) return message.reply('Nhập đúng item cần dùng')

        if (inventory.items[`${item.name}`] <= 0) return message.reply(`Thiếu item ${item.name} để thực hiện tương tác.`)

        const itemDB = {
            name: item.name,
            quantity: -1
        }

        let text = ``

        if (item.name === 'potion') {
            if (inventory.hp == 0) {
                const member = message.guild.roles.cache.get(userId);
                await woundSchema.findOneAndUpdate({ guildId, userId }, {
                    current: false,
                })
                member.roles.remove('wound')
                message.reply('Bạn đã hồi sức!')
            }
            // return message.reply('Bạn đang hồi sức, không dùng item được. Chú ý sử dụng potion trước khi hết máu nhé!')
            let result = await hp.addHP(guildId, userId, 40)
            await economy.addItem(guildId, userId, itemDB)
            text += `Bạn đã sử dụng :test_tube: potion, hồi 40hp. Máu hiện tại :drop_of_blood: ${result}hp`
        } else {
            text += `Các item khác chưa được cài đặt, xin vui lòng sử dụng món khác.`
        }

        const embed = new Discord.MessageEmbed()
            .setColor(`#FFFDC0`)
            .setDescription(text)

        return message.channel.send(embed)

    }
}