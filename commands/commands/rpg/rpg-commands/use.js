const economy = require('@features/economy')
const defaultItem = require('@root/json/rpg.json')
const Discord = require('discord.js');

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
    minArgs: 2,
    maxArgs: 2,
    expectedArgs: "<tên món đồ> <số lượng>",
    permissionError: 'Bạn phải là adventure để sử dụng lệnh này',
    description: "Mua đồ trong shop",
    requiredRoles: ['adventure'],
    cooldown: 5,
    callback: async (message, arguments) => {

        let item = itemCheck(arguments[0])
        const itemQuantity = arguments[1]

        // console.log('item ', item)

        if (!item.name || item.name === String) {
            return message.reply('Nhập đúng item cần mua')
        }

        if (isNaN(itemQuantity) || itemQuantity < 0 || !Number.isInteger(itemQuantity)) {
            return message.reply('Nhập đúng số lượng cần mua')
        }

        const guildId = message.guild.id
        const userId = message.author.id
        const itemDB = {
            name: item.name,
            quantity: itemQuantity
        }

        const coinsOwned = await economy.getCoins(guildId, userId)
        if (coinsOwned < item.price || coinsOwned < item.price * itemQuantity) {
            return message.reply(`Không đủ coins để mua, hãy đánh lệnh daily để nhận coins`)
        }

        const remainingCoins = await economy.addCoins(guildId, userId, item.price * itemQuantity * -1)
        const inventory = await economy.addItem(guildId, userId, itemDB)

        const embed = new Discord.MessageEmbed()
            .setColor(`#b5b5b5`)
            .setDescription(`Bạn đã mua ${itemQuantity} ${item.name}, tiền còn lại :yen: ${remainingCoins}`)

        message.channel.send(embed)


    }
}