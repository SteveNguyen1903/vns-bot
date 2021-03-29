const mongo = require('@db/mongo')
const profileSchema = require('@schema/profile-schema')

const getNeededXP = level => level * level * 100

module.exports = (client) => { }

module.exports.addXP = async (guildId, userId, xpToAdd, message) => {

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
        // message.reply(`You are now level ${level} with ${xp} experience! You now need ${getNeededExp(level)} XP to level up again`)

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
