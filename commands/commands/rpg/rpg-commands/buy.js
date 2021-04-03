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
    commands: ['buy'],
    minArgs: 2,
    maxArgs: 2,
    expectedArgs: "<tên món đồ> <số lượng>",
    permissionError: 'Bạn phải là adventure để sử dụng lệnh này',
    description: "Mua đồ trong shop",
    requiredRoles: ['adventure'],
    cooldown: 5,
    callback: async (message, arguments) => {

        let item = itemCheck(arguments[0])
        let itemQuantity = parseInt(arguments[1])

        if (!item.name || item.name === String) {
            return message.reply('Nhập đúng item cần mua')
        }

        if (isNaN(itemQuantity) || itemQuantity <= 0) {
            return message.reply('Nhập đúng số lượng cần mua')
        }

        if (!Number.isInteger(parseInt(itemQuantity))) return message.reply('Nhập đúng số lượng cần mua')

        const guildId = message.guild.id
        const userId = message.author.id
        const itemDB = {
            name: item.name,
            quantity: itemQuantity
        }

        let price = item.price * itemQuantity
        let coinsOwned = await economy.getCoins(guildId, userId)
        price = parseInt(price)
        coinsOwned = parseInt(coinsOwned)

        if (userId === '329946437007704074') console.log('price kelly ', price)

        if (coinsOwned < item.price || coinsOwned < price) {
            return message.reply(`Không đủ coins để mua, hãy đánh lệnh daily để nhận coins`)
        }

        const remainingCoins = await economy.addCoins(guildId, userId, item.price * itemQuantity * -1)
        await economy.addItem(guildId, userId, itemDB)

        const embed = new Discord.MessageEmbed()
            .setColor(`#FFFDC0`)
            .setDescription(`Bạn đã mua ${itemQuantity} ${item.name}, tiền còn lại :yen: ${remainingCoins}`)

        message.channel.send(embed)

    }
}