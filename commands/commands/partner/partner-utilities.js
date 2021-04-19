const Discord = require('discord.js')
const pn = require('@util/partner/partner-features')
const partnerSchema = require('@schema/partner-schema')
const economy = require('@features/economy')

module.exports = {
	commands: ['pn'],
	minArgs: 1,
	maxArgs: null,
	expectedArgs: '<cú pháp>',
	permissionError: 'Bạn phải là adventure để sử dụng lệnh này',
	description: 'Các lệnh của partner',
	requiredRoles: ['adventure'],
	cooldown: 1,
	callback: async (message, arguments) => {
		const { guild, member } = message
		const guildId = guild.id
		const userId = member.id
		const pnCommand = arguments[0]
		const listCharacters = await pn.getListCharacters()
		const userCharsDb = await partnerSchema.findOne({ userId, guildId })
		const inventory = await economy.showProfile(guildId, userId)
		arguments.shift()
		let secondArg = arguments.join(' ')

		const getRandomCharByStars = (stars) => {
			const characters = listCharacters.filter((character) => character.stars === stars)
			return characters[Math.floor(Math.random() * characters.length)]
		}

		let availability
		if (!userCharsDb) {
			availability = true
			await partnerSchema.findOneAndUpdate({ guildId, userId }, { availability: true }, { upsert: true })
		}

		if (userCharsDb) availability = userCharsDb.availability

		if (!availability) return message.reply('Bạn đang tương tác với partner, hãy hoàn thành xong để dùng lệnh!')

		if (!inventory) return message.reply('Hãy đánh lệnh daily để tạo profile!')

		const pnCommands = ['gacha', 'set', 'info', 'own']
		if (!pnCommands.includes(pnCommand)) return message.reply('Hãy đánh đúng lệnh hiện có!')

		if (pnCommand === 'gacha') {
			if (!secondArg || secondArg <= 0 || secondArg >= 11 || isNaN(secondArg) || !Number.isInteger(+secondArg)) {
				return message.reply('Bạn hãy nhập số lượt quay gacha (từ 1-10)')
			}

			if (inventory.items.letter < secondArg) return message.reply('Bạn không đủ "letter" để gacha, hãy mua thêm!')

			let arrRes = []
			for (let i = 0; i < secondArg; i++) {
				arrRes.push(pn.gachaGame())
			}

			arrRes = arrRes.map((rarity) => (rarity === 0 ? getRandomCharByStars(5) : rarity === 1 ? getRandomCharByStars(4) : getRandomCharByStars(3)))

			const embed = new Discord.MessageEmbed()
				.setColor(`#FFFDC0`)
				.setAuthor(`Kết quả gacha của ${message.author.username}`, `${message.author.displayAvatarURL()}`)
				.setDescription(`Tỉ lệ 5 sao: 5% | Tỉ lệ 4 sao: 15% | Tỉ lệ 3 sao: 80%`)
				.setImage(`${arrRes.some((character) => character.stars === 5) ? 'https://i.imgur.com/tEuhLiO.jpg' : arrRes.some((character) => character.stars === 4) ? 'https://i.imgur.com/L0vVENc.jpg' : 'https://i.imgur.com/sRj9E7z.jpg'}`)

			arrRes.forEach((character) => {
				embed.addFields({
					name: `${character.name[0]}`,
					value: `${character.stars === 5 ? '✭✭✭✭✭' : character.stars === 4 ? '✭✭✭✭' : '✭✭✭'}`,
					inline: true,
				})
			})

			message.reply(embed)

			const fiveStars = arrRes.filter((character) => character.stars === 5)
			let fiveStarsAnnounce = 'Chúc mừng!! Bạn đã trúng '
			if (fiveStars.length > 0) {
				fiveStars.forEach((character) => (fiveStarsAnnounce += `✭✭✭✭✭ ${character.name[0]}! `))
				message.reply(fiveStarsAnnounce)
			}

			let addToDbChars = arrRes
				.map((character) => character.name[0])
				.reduce(function (prev, cur) {
					prev[cur] = (prev[cur] || 0) + 1
					return prev
				}, {})

			addToDbChars = Object.entries(addToDbChars).map((item) => {
				return { name: item[0], copies: item[1] }
			})

			const promises = []

			if (!userCharsDb) {
				addToDbChars.forEach((character) => {
					let obj = { name: character.name, copies: character.copies - 1 }
					const res = partnerSchema.updateOne({ userId, guildId }, { $push: { partners: obj } }, { upsert: true })
					promises.push(res)
					return
				})
			}

			if (userCharsDb) {
				let charsNew = pn.getNewChars(userCharsDb.partners, addToDbChars)
				charsNew = addToDbChars.filter((character) => charsNew.includes(character.name))

				let existingChars = pn.getExistingChars(userCharsDb.partners, addToDbChars)
				existingChars = addToDbChars.filter((character) => existingChars.includes(character.name))

				if (charsNew.length > 0) {
					charsNew.forEach((character) => {
						let obj = { name: character.name, copies: character.copies - 1 }
						const res = partnerSchema.updateOne({ userId, guildId }, { $push: { partners: obj } }, { upsert: true })
						promises.push(res)
						return
					})
				}

				if (existingChars.length > 0) {
					existingChars.forEach((character) => {
						const res = partnerSchema.updateOne({ userId, guildId, 'partners.name': character.name }, { $inc: { 'partners.$.copies': character.copies } })
						promises.push(res)
						return
					})
				}
			}

			const itemDB = { name: 'letter', quantity: -1 * secondArg }
			await economy.addItem(guildId, userId, itemDB)

			Promise.all(promises).catch((err) => {
				console.log(err)
				message.reply('Có lỗi trong quá trình xử lý, vui lòng thử lại sau!')
			})
		} //gacha

		if (pnCommand === 'set') {
			if (!secondArg || !pn.ifExistInList(listCharacters, secondArg)) {
				return message.reply('Bạn hãy điền đúng tên partner hiện có để set!')
			}

			if (!userCharsDb || !pn.ifExistInList(userCharsDb.partners, secondArg)) {
				return message.reply('Bạn chưa có partner này để set! Hãy gacha!')
			}

			let partner = listCharacters.filter((char) => char.name.some((char1) => char1.includes(secondArg)))
			const embed = new Discord.MessageEmbed()
				.setColor(`#FFFDC0`)
				.setTitle(`${partner[0].name[0]} ${partner[0].stars === 5 ? '✭✭✭✭✭' : partner[0].stars === 4 ? '✭✭✭✭' : '✭✭✭'}`)
				.setAuthor(`Partner của ${message.author.username}`, `${message.author.displayAvatarURL()}`)
				.setThumbnail(`${partner[0].img[Math.floor(Math.random() * partner[0].img.length)]}`)
				.setDescription(`<@${userId}> đã chọn ${partner[0].name[0]} làm partner!`)
				.addFields({ name: 'Miêu tả', value: `${partner[0].description}` })
			message.channel.send(embed)

			try {
				await partnerSchema.updateOne({ userId, guildId }, { currentPartner: `${partner[0].name[0]}` }, { upsert: true }).exec()
			} catch (err) {
				console.log(err)
				message.reply('Có lỗi trong quá trình xử lý, vui lòng thử lại sau!')
			}
		} // set partner

		if (pnCommand === 'info') {
			let threeStars = listCharacters.filter((character) => character.stars === 3)
			let fourStars = listCharacters.filter((character) => character.stars === 4)
			let fiveStars = listCharacters.filter((character) => character.stars === 5)

			let txt3 = ``
			let txt4 = ``
			let txt5 = ``

			threeStars.forEach((char) => (txt3 += `${char.name[0]}\n`))
			fourStars.forEach((char) => (txt4 += `${char.name[0]}\n`))
			fiveStars.forEach((char) => (txt5 += `${char.name[0]}\n`))

			const embed = new Discord.MessageEmbed().setColor(`#FFFDC0`).addFields({ name: '✭✭✭', value: `${txt3}`, inline: true }, { name: '✭✭✭✭', value: `${txt4}`, inline: true }, { name: '✭✭✭✭✭', value: `${txt5}`, inline: true })
			message.channel.send(embed)
		}

		if (pnCommand === 'own') {
			if (!userCharsDb.partners) return message.reply('Bạn chưa có partner nào, hãy gacha!')

			let ownCharacters = userCharsDb.partners.map((character) => {
				const res = listCharacters.filter((item) => item.name[0] === character.name)
				return res
			})

			ownCharacters = ownCharacters.filter((item) => {
				if (item.length > 0) return item
			})

			let threeStars = ownCharacters.filter((character) => {
				if (character) return character[0].stars === 3
			})
			let fourStars = ownCharacters.filter((character) => {
				if (character) return character[0].stars === 4
			})
			let fiveStars = ownCharacters.filter((character) => {
				if (character) return character[0].stars === 5
			})

			let txt3 = ``
			let txt4 = ``
			let txt5 = ``

			threeStars.forEach((char) => (txt3 += `${char[0].name[0]}\n`))
			fourStars.forEach((char) => (txt4 += `${char[0].name[0]}\n`))
			fiveStars.forEach((char) => (txt5 += `${char[0].name[0]}\n`))

			const embed = new Discord.MessageEmbed()
				.setColor(`#FFFDC0`)
				.addFields({ name: '✭✭✭', value: `${txt3}`, inline: true }, { name: '✭✭✭✭', value: `${txt4}`, inline: true }, { name: '✭✭✭✭✭', value: `${txt5}`, inline: true })
				.setAuthor(`Partner ${message.author.username} đang sở hữu`, `${message.author.displayAvatarURL()}`)
			message.channel.send(embed)
		}
	},
}
