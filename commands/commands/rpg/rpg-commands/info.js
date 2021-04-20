const economy = require('@features/economy')
const Discord = require('discord.js')
const partnerSchema = require('@schema/partner-schema')
const pn = require('@util/partner/partner-features')

const getNeededXP = (level) => level * level * 100
const maxHP = (level) => level * 20 + 100

module.exports = {
	commands: ['info'],
	expectedArgs: 'Rỗng',
	permissionError: 'Bạn phải là adventure để sử dụng lệnh này',
	description: 'Hòm đồ',
	requiredRoles: ['adventure'],
	cooldown: 5,
	callback: async (message) => {
		const guildId = message.guild.id
		const userId = message.author.id
		const inventory = await economy.showProfile(guildId, userId)
		const userCharsDb = await partnerSchema.findOne({ userId, guildId })
		const listCharacters = await pn.getListCharacters()

		if (!inventory) return message.reply('Hãy đánh lệnh daily để tạo profile!')

		let partner = userCharsDb?.currentPartner ? userCharsDb.currentPartner : 'chưa có'
		let marry = userCharsDb?.currentMarry ? userCharsDb.currentMarry : 'chưa kết hôn'

		let partnerAva = listCharacters.filter((character) => character.name.includes(partner))
		partnerAva = partnerAva.length > 0 ? partnerAva[0].img[Math.floor(Math.random() * partnerAva[0].img.length)] : ''

		let marryAva = listCharacters.filter((character) => character.name.includes(marry))
		marryAva = marryAva.length > 0 ? marryAva[0].img[Math.floor(Math.random() * marryAva[0].img.length)] : ''

		const embed = new Discord.MessageEmbed()
			.setColor(`#FFFDC0`)
			// .setTitle(`Thế giới Leidenschaftlich`)
			// .setURL('https://discord.js.org/')
			.setAuthor(`Partner: ${partner}`, `${partnerAva}`)
			.setDescription(`Thế giới Leidenschaftlich\nHồ sơ hành gia <@${userId}>`)
			.setThumbnail(`${message.author.displayAvatarURL()}`)
			.addFields(
				{ name: 'Thông tin', value: `:yen: Tiền: ${inventory.coins}\n:cross: EXP: ${inventory.xp}/${getNeededXP(inventory.level)} đến **level ${inventory.level + 1}**\n:drop_of_blood: HP: ${inventory.hp}/${maxHP(inventory.level)}` },
				{
					name: 'Hòm đồ',
					value: `:coin: Token: ${inventory.items.token}\n:envelope: Letter: ${inventory.items.letter}\n:test_tube: Potion: ${inventory.items.potion}\n:gift: Gift: ${inventory.items.gift}`,
				},
			)
			.setFooter(`Kết hôn: ${marry}`, `${marryAva}`)
		message.channel.send(embed)
	},
}
