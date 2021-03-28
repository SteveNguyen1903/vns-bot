const mongo = require('@db/mongo')
const profileSchema = require('@schema/profile-schema')
const woundSchema = require('@schema/wound-schema')

const coinsCache = {}

module.exports = (client) => { }

module.exports.addCoins = async (guildId, userId, coins) => {
    return await mongo().then(async (mongoose) => {
        try {

            const result = await profileSchema.findOneAndUpdate(
                {
                    guildId,
                    userId
                },
                {
                    guildId, userId, $inc: {
                        coins
                    }
                },
                {
                    upsert: true,
                    new: true
                })

            // console.log('RESULT: ', result)

            coinsCache[`${guildId}-${userId}`] = result.coins

            return result.coins
        } finally {
            mongoose.connection.close()
        }
    })
}

module.exports.getCoins = async (guildId, userId) => {
    const cachedValue = coinsCache[`${guildId}-${userId}`]
    if (cachedValue) {
        return cachedValue
    }

    return await mongo().then(async mongoose => {
        try {

            const result = await profileSchema.findOne({
                guildId,
                userId
            })

            // console.log('RESULT: ', result)

            let coins = 0
            if (result) {
                coins = result.coins
            } else {
                console.log('Inserting a document')
                await new profileSchema({
                    guildId,
                    userId,
                    coins
                }).save()
            }

            coinsCache[`${guildId}-${userId}`] = coins
            return coins
        } finally {
            mongoose.connection.close()
        }
    })
}

module.exports.addItem = async (guildId, userId, item) => {

    let itemName = item.name;
    let itemQuantity = item.quantity

    return await mongo().then(async (mongoose) => {
        try {
            const result = await profileSchema.findOneAndUpdate(
                {
                    guildId,
                    userId
                },
                {
                    guildId, userId,
                    $inc: { [`items.${itemName}`]: itemQuantity },
                },
                {
                    upsert: true,
                    new: true
                })
            // console.log('RESULT: ', result)
            // coinsCache[`${guildId}-${userId}`] = result.coins
            return result.items
        } finally {
            mongoose.connection.close()
        }
    })
}

module.exports.addWound = async (guild, guildId, userId, minute) => {

    return await mongo().then(async (mongoose) => {
        try {
            await profileSchema.find(
                {
                    guildId,
                    status: true
                })

            const expires = new Date()
            expires.setMinutes(expires.getMinutes() + minute)

            const result = await woundSchema.findOneAndUpdate(
                {
                    guildId,
                    userId
                },
                {
                    expires,
                    current: true
                },
                {
                    upsert: true,
                    new: true
                })

            //check role
            const roleName = 'wound'
            const role = guild.roles.cache.find((role) => {
                return role.name === roleName
            })

            if (!role) return message.reply(`Err: Không có role wound ${roleName}`)

            const member = guild.members.cache.get(userId)

            //check result and add role
            if (result.current) member.roles.add(role)

        } finally {
            mongoose.connection.close()
        }
    })

}

module.exports.showProfile = async (guildId, userId) => {
    return await mongo().then(async mongoose => {
        try {
            const result = await profileSchema.findOne({
                guildId,
                userId
            })
            return result
        } finally {
            mongoose.connection.close()
        }
    })
}