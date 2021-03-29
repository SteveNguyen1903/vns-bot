const woundSchema = require('@schema/wound-schema')
const mongo = require('@db/mongo')
const { Message } = require('discord.js')

module.exports = (client) => {
    const checkRoles = async () => {

        const now = new Date()

        const conditional = {
            expires: {
                $lt: now,
            },
            current: true,
        }

        // const results = await woundSchema.find(conditional)


        const results = await woundSchema.find(conditional)

        if (results && results.length) {
            console.log('wound role to remove ', results)
            for (const result of results) {

                const { guildId, userId } = result

                const guild = client.guilds.cache.get(guildId)
                const member = (await guild.members.fetch()).get(userId)

                const woundRole = guild.roles.cache.find((role) => {
                    return role.name === 'wound'
                })

                const channel = await client.channels.cache.get('824985062956204032')
                channel.send(`<@${userId}> đã hồi phục xong`)
                member.roles.remove(woundRole)
            }

            await woundSchema.updateMany(conditional, {
                current: false,
            })
        }



        setTimeout(checkRoles, 1000 * 60 * 5)
    }
    checkRoles()

    client.on('guildMemberAdd', async (member) => {
        const { guild, id } = member

        const currentMute = await muteSchema.findOne({
            userId: id,
            guildId: guild.id,
            current: true,
        })

        if (currentMute) {
            const role = guild.roles.cache.find((role) => {
                return role.name === 'wound'
            })

            if (role) {
                member.roles.add(role)
            }
        }
    })
}

