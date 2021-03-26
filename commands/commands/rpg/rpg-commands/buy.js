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
    expectedArgs: "<Item's name> <cost>",
    permissionError: 'You must be an admin to use this command',
    description: "Buy item",
    permissions: 'ADMINISTRATOR',
    callback: async (message, arguments) => {

        let item = itemCheck(arguments[0])
        const itemQuantity = arguments[1]

        // console.log('item ', item)

        if (!item.name || item.name === String) {
            return message.reply('Nhập đúng item cần mua')
        }

        if (isNaN(itemQuantity) || itemQuantity < 0) {
            return message.reply('Nhập đúng số lượng cần mua')
        }

        const guildId = message.guild.id
        const userId = message.author.id
        const itemDB = {
            name: item.name,
            quantity: itemQuantity
        }

        // console.log('message author ', message.author)

        const coinsOwned = await economy.getCoins(guildId, userId)
        if (coinsOwned < item.price || coinsOwned < item.price * itemQuantity) {
            return message.reply(`Không đủ coins để mua`)

        }

        const remainingCoins = await economy.addCoins(guildId, userId, item.price * itemQuantity * -1)
        const inventory = await economy.addItem(guildId, userId, itemDB)

        // console.log('invent ', inventory)

        const embed = new Discord.MessageEmbed()
            .setColor(`#00AAF`)
            .setTitle(`Thế giới Leidenschaftlich`)
            // .setURL('https://discord.js.org/')
            // .setAuthor('Some name', 'https://i.imgur.com/wSTFkRM.png', 'https://discord.js.org')
            .setDescription(`Hồ sơ hành gia <@${userId}>`)
            .setThumbnail(`${message.author.displayAvatarURL()}`)
            .addFields(
                { name: 'Thông tin', value: `:yen: Tiền: ${remainingCoins}` },
                { name: 'EXP', value: `:cross: EXP: 200/500 đến level 2` },
                {
                    name: 'Hòm đồ',
                    value: `:coin: Token: ${inventory.token}\n:envelope: Letter: ${inventory.letter}\n:test_tube: Potion: ${inventory.potion}`
                })
            .setTimestamp()
            .setFooter('Developed by v4v', '');
        message.channel.send(embed)


    }
}