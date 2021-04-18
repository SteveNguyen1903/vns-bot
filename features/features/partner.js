const partnerSchema = require('@schema/partner-schema')

module.exports = (client) => {
	//check poke
	const pokeRegen = async () => {
		const now = new Date()
		const conditional = { pokeTimes: { $lt: 3 }, pokeRegen: { $lt: now } }
		const results = await partnerSchema.find(conditional)
		if (results && results.length) {
			for (const result of results) {
				const { guildId, userId } = result
				await partnerSchema.updateOne({ guildId, userId }, { $inc: { pokeTimes: 1 } })
			}
			now.setHours(now.getHours() + 8)
			await partnerSchema.updateMany(conditional, { pokeRegen: now })
		}

		const newProfiles = await partnerSchema.find({ pokeRegen: null })

		if (newProfiles && newProfiles.length) {
			const res = await partnerSchema.updateMany({}, { pokeRegen: now, pokeTimes: 3 }, { upsert: true, new: true })
		}

		setTimeout(pokeRegen, 1000 * 60 * 60 * 1)
	}

	pokeRegen()
}
