const mongo = require('@db/mongo')
const warnSchema = require('@schema/warn-schema')

module.exports = {
    commands: 'warn',
    minArgs: 2,
    expectedArgs: "<Target user's @> <reason>",
    requiredRoles: ['Moderator'],
    callback: async (message, arguments) => {
        const target = message.mentions.users.first()
        if (!target) {
            message.reply('Please specify someone to warn')
            return
        }

        arguments.shift()

        const guildId = message.guild.id
        const userId = message.member.id
        const reason = arguments.join(' ')

        //console.log test
        if (message.channel.id == '816865305807814676') {
            console.log(guildId, userId, reason)
        }

        const warning = {
            author: message.member.user.tag,
            timestamp: new Date().getTime(),
            reason
        }


        await warnSchema.findOneAndUpdate({
            guildId,
            userId
        }, {
            guildId,
            userId,
            $push: {
                warnings: warning
            }
        }, {
            upsert: true
        })


    }
}