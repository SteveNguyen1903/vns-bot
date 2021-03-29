const mongo = require('@db/mongo')
const warnSchema = require('@schema/warn-schema')

module.exports = {
    commands: ['listwarnings', 'lw'],
    minArgs: 1,
    expectedArgs: "<Target user's @>",
    requiredRoles: ['Moderator'],
    callback: async (message, arguments, text) => {
        const target = message.mentions.users.first()
        if (!target) {
            message.reply('Please specify user to load message for')
            return
        }

        const guildId = message.guild.id
        const userId = message.member.id


        const result = await warnSchema.findOne({
            guildId,
            userId
        })

        let reply = `Previous warnings for <@${userId}>: \n\n`

        for (const warning of result.warnings) {
            const { author, timestamp, reason } = warning
            reply += `By ${author} on ${new Date(timestamp).toLocaleDateString()} for "${reason}"\n\n`
        }

        message.reply(reply)

    }
}