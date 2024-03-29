const mongoose = require('mongoose')

const reqString = {
	type: String,
	require: true,
}

const profileSchema = mongoose.Schema(
	{
		guildId: reqString,
		userId: reqString,
		coins: {
			type: Number,
			default: 0,
		},
		xp: {
			type: Number,
			default: 0,
		},
		level: {
			type: Number,
			default: 1,
		},
		hp: {
			type: Number,
			default: 100,
		},
		items: {
			token: {
				type: Number,
				default: 0,
			},
			letter: {
				type: Number,
				default: 0,
			},
			potion: {
				type: Number,
				default: 0,
			},
			gift: {
				type: Number,
				default: 0,
			},
		},
		identity: {
			jobs: { type: Array },
		},
		availability: {
			type: Boolean,
			default: true,
			require: true,
		},
	},
	{
		timestamps: true,
	},
)

module.exports = mongoose.model('profiles', profileSchema)
