const profileSchema = require('@schema/profile-schema')

const maxHPCheck = level => level * 20 + 100

module.exports = (client) => {

}

module.exports.addHP = async (guildId, userId, hpToAdd, message) => {

    let result = await profileSchema.findOneAndUpdate({
        guildId,
        userId
    }, {
        guildId,
        userId,
        $inc: {
            hp: hpToAdd
        }
    }, {
        upsert: true,
        new: true
    })

    let { hp, level } = result
    const maxHP = maxHPCheck(level)

    //check for max hp level
    if (hp >= maxHP) {
        hp = maxHP
        const newResult = await profileSchema.findOneAndUpdate({
            guildId,
            userId
        }, {
            hp,
        }, {
            upsert: true,
            new: true
        })
        return newResult
    }

    if (hp <= 0) {
        hp = 0
        const newResult = await profileSchema.findOneAndUpdate({
            guildId,
            userId
        }, {
            hp,
        }, {
            upsert: true,
            new: true
        })
        return newResult
    }

    return result

}
