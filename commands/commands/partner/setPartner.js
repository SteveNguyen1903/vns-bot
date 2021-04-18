// const core = require('@core/core')
// const Discord = require('discord.js');
const pn = require('@util/partner/partner-features')

module.exports = {
	commands: ['ps'],
	minArgs: 1,
	maxArgs: 1,
	expectedArgs: '<tên partner>',
	permissionError: 'Bạn phải là v4v để sử dụng lệnh này',
	description: 'Mua đồ trong shop',
	requiredRoles: ['v4v'],
	cooldown: 5,
	callback: async (message, arguments) => {
		const { guild, member } = message
		const guildId = guild.id
		const userId = member.id
		const partnerName = arguments[0]
		const userPartners = await pn.checkPartner(guildId, userId)

		if (!userPartners) return message.reply('Bạn chưa có partner nào để set, xin hãy gacha để có partner trước!')

		console.log('userPartner ', userPartners)
		console.log('partnerName ', partnerName)
		// console.log('check ', partnerFeatures.checkPartner)
	},
}
