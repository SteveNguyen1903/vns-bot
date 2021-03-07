const mongo = require('../mongo')
const command = require('../command')
const welcomeSchema = require('../schema/welcome-schema')

module.exports = (client) => {

    command(client, 'setwelcome', async (message) => {
        const { member, channel, content, guild } = message

        if (!member.hasPermission('ADMINISTRATION')) {
            channel.send('Không phải admin')
            return
        }

        let text = content

        const split = text.split(' ')

        if (split.length < 2) {
            channel.send('Please provide a welcome message')
            return
        }

        split.shift()
        text = split.join(' ')

        await mongo().then(async (mongoose) => {
            try {
                await new welcomeSchema({
                    _id: guild.id,
                    channelId: channel.id,
                    text
                }).save()
            } finally {
                mongoose.connection.close()
            }
        })
    })

}