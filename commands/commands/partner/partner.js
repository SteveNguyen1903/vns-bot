const { Character, lowRarity } = require('@util/rpg/characters/character')
const core = require('@core/core')
const pn = require('@util/partner/partner-features')
const Discord = require('discord.js')
const partnerSchema = require('@schema/partner-schema')
const partnerDialogue = require('@root/json/partner-dialogue')
const economy = require('@features/economy')
const profileSchema = require('@schema/profile-schema')

module.exports = {
	commands: ['partner'],
	minArgs: 0,
	maxArgs: 0,
	expectedArgs: 'Không',
	permissionError: 'Bạn phải là adventure để sử dụng lệnh này',
	description: 'Tương tác với partner',
	requiredRoles: ['adventure'],
	cooldown: 5,
	callback: async (message, arguments) => {
		const { guild, member } = message
		const guildId = guild.id
		const userId = member.id
		const listCharacters = await pn.getListCharacters()
		const userCharsDb = await partnerSchema.findOne({ userId, guildId })
		const inventory = await economy.showProfile(guildId, userId)

		if (!userCharsDb || !userCharsDb.currentPartner) return message.reply('Hãy chọn partner trước khi tương tác bằng cú pháp "!!pn set <tên partner>"')

		if (!userCharsDb.availability) return message.reply('Bạn đang tương tác với partner, hãy hoàn thành xong để dùng lệnh!')

		const partner = userCharsDb.partners.filter((character) => character.name === userCharsDb.currentPartner)
		let { name, xp, affectionLvl, copies, ascension } = partner[0]

		if (!xp) xp = 0
		if (!affectionLvl) affectionLvl = 1
		if (!ascension) ascension = 1

		const partnerInfo = listCharacters.filter((character) => character.name.includes(name))

		let { anime, stars, description, img, type } = partnerInfo[0]

		const character = new Character(name, xp, affectionLvl, copies, ascension, anime, stars, description, img)
		const emojs = ['🤏', '🎁', '⏫', '💍']
		let currentMarry = userCharsDb.currentMarry ? userCharsDb.currentMarry : null
		let pokeTimes = userCharsDb.pokeTimes ? userCharsDb.pokeTimes : 3
		let gift = inventory.items.gift
		let dialogue = partnerDialogue.filter((voiceLine) => voiceLine.type === type)
		let now = new Date()
		let marryRegen = userCharsDb.marryRegen ? userCharsDb.marryRegen : now

		const embed = new Discord.MessageEmbed()
			.setColor(`#FFFDC0`)
			.setAuthor(`${currentMarry === name ? 'Đã kết hôn' : ' Chưa kết hôn'}`, `${message.author.displayAvatarURL()}`)
			.setTitle(`${character.name} ${character.showStars}`)
			.setThumbnail(`${character.img[Math.floor(Math.random() * character.img.length)]}`)
			.setDescription(`${character.description}`)
			.addFields(
				{
					name: 'Điểm thân mật',
					value: `${character.xp}/${character.neededXp}, **level ${character.affectionLvl}**`,
					inline: true,
				},
				{
					name: 'Ascension',
					value: `${character.ascension} / **5**`,
					inline: true,
				},
				{
					name: 'Mảnh nhân vật',
					value: `${character.copies}`,
					inline: true,
				},
				{
					name: 'Tổng quan',
					value: `Anime: ${character.anime}\nCơ hội thành công cộng thêm: ${(character.bonusChance * 100).toFixed(2)}%`,
				},
				{
					name: 'Tương tác',
					value: `┊ 🤏 để tương tác ┊ 🎁 để gift ┊ ⏫ để nâng ascension ┊ 💍 để đính hôn ┊`,
				},
			)
			.setTimestamp()
			.setFooter('Developed by v4v', 'https://i.imgur.com/pmDv6Hb.png')

		message.channel.send(embed).then(async (msg) => {
			await partnerSchema.updateOne({ userId, guildId }, { availability: false }, { upsert: true })
			emojs.forEach((r) => msg.react(r))
			const filter = (r, u) => emojs.includes(r.emoji.name) && u.id === message.author.id
			const partner = msg.createReactionCollector(filter, { time: 20000 })

			partner.on('collect', (r, u) => {
				let answer = r.emoji.name
				let text

				r.users.remove(r.users.cache.find((u) => u === message.author))

				switch (answer) {
					case '🤏':
						if (pokeTimes <= 0) {
							embed.fields[4] = { name: 'Tương tác', value: 'Bạn đã hết lượt tương tác! Hãy chờ hồi lại!' }
							msg.edit(embed)
							break
						}
						pokeTimes--

						character.addXp(50)
						text = `${dialogue[0].poke[Math.floor(Math.random() * dialogue[0].poke.length)]}`
						if (text.includes('<user>')) text = text.replace(/<user>/g, `<@${userId}>`)
						if (text.includes('<partner>')) text = text.replace(/<partner>/g, `${name}`)

						embed.fields[0] = { name: 'Điểm thân mật', value: `${character.xp}/${character.neededXp}, **level ${character.affectionLvl}**`, inline: true }
						embed.fields[4] = { name: 'Tương tác', value: `${text}` }
						msg.edit(embed)
						break
					case '🎁':
						if (gift <= 0) {
							embed.fields[4] = { name: 'Tương tác', value: 'Bạn không có gift! Hãy mua thêm!' }
							msg.edit(embed)
							break
						}
						gift--

						character.addXp(150)
						text = `${dialogue[0].gift[Math.floor(Math.random() * dialogue[0].poke.length)]}`
						if (text.includes('<user>')) text = text.replace(/<user>/g, `<@${userId}>`)
						if (text.includes('<partner>')) text = text.replace(/<partner>/g, `${name}`)

						embed.fields[0] = { name: 'Điểm thân mật', value: `${character.xp}/${character.neededXp}, **level ${character.affectionLvl}**`, inline: true }
						embed.fields[4] = { name: 'Tương tác', value: `${text}` }
						msg.edit(embed)
						break
					case '⏫':
						if (copies <= 0) {
							embed.fields[4] = { name: 'Tương tác', value: 'Bạn không đủ mảnh copies để nâng ascension của nhân vật! Hãy mua thêm' }
							msg.edit(embed)
							break
						}

						if (ascension >= 5) {
							embed.fields[4] = { name: 'Tương tác', value: 'Nhân vật đã đạt tối đa mức độ ascension!' }
							msg.edit(embed)
							break
						}
						copies--
						ascension++
						character.upAscension()
						text = `${dialogue[0].ascension[Math.floor(Math.random() * dialogue[0].poke.length)]}`
						if (text.includes('<user>')) text = text.replace(/<user>/g, `<@${userId}>`)
						if (text.includes('<partner>')) text = text.replace(/<partner>/g, `${name}`)

						embed.fields[1] = { name: 'Ascension', value: `${character.ascension} / **5**`, inline: true }
						embed.fields[2] = { name: 'Mảnh nhân vật', value: `${character.copies}`, inline: true }
						embed.fields[4] = { name: 'Tương tác', value: `${text}` }
						msg.edit(embed)
						break
					case '💍':
						if (affectionLvl < 10) {
							embed.fields[4] = { name: 'Tương tác', value: 'Chỉ kết hôn được khi **mức thân mật ở 10**! Hãy tương tác và mua quà để cải thiện!' }
							msg.edit(embed)
							break
						}

						if (currentMarry && currentMarry === name) {
							embed.fields[4] = { name: 'Tương tác', value: `Bạn đã kết hôn với ${name} rồi!` }
							msg.edit(embed)
							break
						}

						if (marryRegen > now) {
							const diffTime = Math.abs(marryRegen - now)
							const hoursLeft = diffTime / (1000 * 60 * 60)
							embed.fields[4] = { name: 'Tương tác', value: `Bạn đã kết hôn gần đây, hãy chờ ${hoursLeft.toFixed(2)}h để kết hôn lần nữa!` }
							msg.edit(embed)
							break
						}

						currentMarry = name
						marryRegen = now.setHours(now.getHours() + 24)
						message.channel.send(`<@${userId}> đã kết hôn với **${name}**!!! Đây là một sự kiện trọng đại, các <@&824985374765875260> hãy cùng chúc mừng họ nào!!`).then((message) => message.react('🎉'))
						embed.fields[4] = { name: 'Tương tác', value: 'Đính hôn !!!!!' }
						msg.edit(embed)
						break
					default:
						break
				}
			})
			partner.on('end', async (c, r) => {
				try {
					await partnerSchema.updateOne({ userId, guildId, 'partners.name': name }, { availability: true, currentMarry: currentMarry, marryRegen: marryRegen, pokeTimes: pokeTimes, 'partners.$.copies': character.copies, 'partners.$.affectionLvl': character.affectionLvl, 'partners.$.xp': character.xp, 'partners.$.ascension': character.ascension }, { upsert: true })
					await profileSchema.updateOne({ guildId, userId }, { 'items.gift': gift })
				} catch (err) {
					console.log(err)
					message.reply('Có lỗi trong quá trình xử lý, vui lòng thử lại sau')
				}

				embed.fields[4] = {
					name: 'Tương tác',
					value: 'Kết thúc tương tác tại đây',
				}
				msg.edit(embed)
			})
		}) //msg send
	},
}
