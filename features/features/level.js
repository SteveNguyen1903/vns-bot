const profileSchema = require('@schema/profile-schema')

const getNeededXP = level => level * level * 100

// eslint-disable-next-line no-unused-vars
module.exports = (client) => { }

module.exports.addXP = async (guildId, userId, xpToAdd) => {

    let result = await profileSchema.findOneAndUpdate({
        guildId,
        userId
    }, {
        guildId,
        userId,
        $inc: {
            xp: xpToAdd
        }
    }, {
        upsert: true,
        new: true
    })

    let { xp, level } = result
    const needed = getNeededXP(level)

    if (xp >= needed) {
        ++level
        xp -= needed

        const newResult = await profileSchema.findOneAndUpdate({
            guildId,
            userId
        }, {
            xp,
            level,
        }, {
            upsert: true,
            new: true
        })
        return newResult
    }
    return result

}
