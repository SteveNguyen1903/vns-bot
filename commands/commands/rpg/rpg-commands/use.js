const economy = require('@features/economy')
const hp = require('@features/hp')
const defaultItem = require('@root/json/rpg.json')
// const woundSchema = require('@schema/wound-schema')
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
    minArgs: 1,
    maxArgs: 1,
    expectedArgs: "<tên món đồ> <số lượng>",
    permissionError: 'Bạn phải là adventure để sử dụng lệnh này',
    description: "Mua đồ trong shop",
    requiredRoles: ['adventure'],
    cooldown: 5,
    callback: async (message, arguments) => {

        let item = itemCheck(arguments[0])

        // console.log('item ', item)

        if (!item.name || item.name === String) {
            return message.reply('Nhập đúng item cần dùng')
        }

        const guildId = message.guild.id
        const userId = message.author.id
        const itemDB = {
            name: item.name,
            quantity: 1
        }

        if (item.name === 'potion') {
            let result = await hp.addHP(guildId, userId, 40)
            console.log('result ', result)
        }


        // const embed = new Discord.MessageEmbed()
        //     .setColor(`#b5b5b5`)
        //     .setDescription(`Bạn đã mua ${itemQuantity} ${item.name}, tiền còn lại :yen: ${remainingCoins}`)

        // message.channel.send(embed)


    }
}