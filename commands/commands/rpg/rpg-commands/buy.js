const economy = require('@features/economy')
const defaultItem = require('@root/json/rpg.json')
const Discord = require('discord.js')
const partnerSchema = require('@schema/partner-schema')

//check if item exists
const itemCheck = (itemName) => {
	// const result = defaultItem.items.includes(item);
	let result = {}
	defaultItem.items.forEach((item) => {
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
	expectedArgs: '<tên món đồ> <số lượng>',
	permissionError: 'Bạn phải là adventure để sử dụng lệnh này',
	description: 'Mua đồ trong shop',
	requiredRoles: ['adventure'],
	cooldown: 5,
	callback: async (message, arguments) => {
		const { guild, member } = message
		const guildId = guild.id
		const userId = member.id
		let item = itemCheck(arguments[0])
		let itemQuantity = parseInt(arguments[1])
		let userPartnerDb = await partnerSchema.findOne({ guildId, userId })
		let availability = userPartnerDb?.availability

		if (availability === undefined) availability = true

		if (availability === false) return message.reply('Hãy hoàn thành xong tương tác với partner trước khi dùng lệnh này!')

		if (!item.name || item.name === String) {
			return message.reply('Nhập đúng item cần mua')
		}

		if (isNaN(itemQuantity) || itemQuantity <= 0) {
			return message.reply('Nhập đúng số lượng cần mua')
		}

		if (!Number.isInteger(+itemQuantity)) return message.reply('Nhập đúng số lượng cần mua')

		const itemDB = {
			name: item.name,
			quantity: itemQuantity,
		}

		let itemPrice = parseInt(item.price)
		let price = itemPrice * itemQuantity
		let coinsOwned = await economy.getCoins(guildId, userId)
		price = parseInt(price)
		coinsOwned = parseInt(coinsOwned)

		if (coinsOwned < itemPrice || coinsOwned < price) {
			return message.reply(`Không đủ coins để mua, hãy đánh lệnh daily để nhận coins`)
		}

		const remainingCoins = await economy.addCoins(guildId, userId, itemPrice * itemQuantity * -1)
		await economy.addItem(guildId, userId, itemDB)

		const embed = new Discord.MessageEmbed().setColor(`#FFFDC0`).setDescription(`Bạn đã mua ${itemQuantity} ${item.name}, tiền còn lại :yen: ${remainingCoins}`)

		message.channel.send(embed)
	},
}
