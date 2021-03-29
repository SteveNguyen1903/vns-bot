const mongo = require('@db/mongo')
const command = require('@ulti/command')
const welcomeSchema = require('@schema/welcome-schema')

module.exports = (client) => {

    const cache = {} //guildId: [channelId, text]

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

        cache[guild.id] = [channel.id, text]


        // await new welcomeSchema({
        //     _id: guild.id,
        //     channelId: channel.id,
        //     text
        // }).save()
        await welcomeSchema.findOneAndUpdate({
            _id: guild.id
        }, {
            _id: guild.id,
            channelId: channel.id,
            text
        }, {
            upsert: true

        })

    })

    const onJoin = async (member) => {
        const { guild } = member

        let data = cache[guild.id]

        if (!data) {
            console.log('fetching from database')

            const result = await welcomeSchema.findOne({ _id: guild.id })
            cache[guild.id] = data = [result.channelId, result.text]

        }

        const channelId = data[0]
        const text = data[1]

        const channel = guild.channels.cache.get(channelId)
        channel.send(text.replace(/<@>/g, `<@${member.id}>`))


    }

    command(client, 'simjoin', (message) => {
        onJoin(message.member)
    })

    // client.on('guildMemberAdd', (member) => {
    //     onJoin(member)
    // })
}