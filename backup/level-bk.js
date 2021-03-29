const mongo = require('@db/mongo')
const profileSchema = require('@schema/profile-schema')

module.exports = (client) => {
    client.on('message', message => {
        const { guild, member } = message

        // //message test channel
        // if (message.channel.id == '816865305807814676') {
        //     addXP(guild.id, member.id, 23, message)
        // }

    })
}

const getNeededXP = level => level * level * 100

const addXP = async (guildId, userId, xpToAdd, message) => {

    const result = await profileSchema.findOneAndUpdate({
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

        message.reply(`You are now level ${level} with ${xp} experience! You now need ${getNeededExp(level)} XP to level up again`)

        await profileSchema.updateOne({
            guildId,
            userId
        }, {
            level,
            xp
        })
    }
}

module.exports.addXP = addXP