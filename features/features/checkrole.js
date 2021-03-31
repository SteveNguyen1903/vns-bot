const woundSchema = require('@schema/wound-schema')
const hp = require('@features/hp')


module.exports = (client) => {
    const checkRoles = async () => {

        const now = new Date()
        const conditional = {
            expires: {
                $lt: now,
            },
            current: true,
        }

        const results = await woundSchema.find(conditional)

        if (results && results.length) {
            for (const result of results) {
                const { guildId, userId } = result
                const guild = client.guilds.cache.get(guildId)
                const member = (await guild.members.fetch()).get(userId)
                const woundRole = guild.roles.cache.find((role) => {
                    return role.name === 'wound'
                })
                const channel = await client.channels.cache.get('824985062956204032')
                member.roles.remove(woundRole)
                await hp.addHP(guildId, userId, 5)
                channel.send(`<@${userId}> đã hồi phục xong, hp +10`)
            }
            await woundSchema.updateMany(conditional, {
                current: false,
            })
        }
        setTimeout(checkRoles, 1000 * 60 * 5)
    }

    checkRoles()

    //hp regen
    const hpRegen = async () => {
        const now = new Date()
        const conditional = {
            hpRegen: {
                $lt: now,
            }
        }
        const results = await woundSchema.find(conditional)
        if (results && results.length) {
            for (const result of results) {
                const { guildId, userId } = result
                await hp.addHP(guildId, userId, 40)
            }
            now.setHours(now.getHours() + 12)
            await woundSchema.updateMany(conditional, {
                hpRegen: now,
            })
        }

        const newProfiles = await woundSchema.find({ hpRegen: null })
        if (newProfiles && newProfiles.length) {
            await woundSchema.updateMany({}, {
                hpRegen: now,
            }, { upsert: true })
        }

        setTimeout(hpRegen, 1000 * 60 * 60 * 12)
    }

    hpRegen()

    //on member quit
    client.on('guildMemberAdd', async (member) => {
        const { guild, id } = member

        const currentWound = await woundSchema.findOne({
            userId: id,
            guildId: guild.id,
            current: true,
        })

        if (currentWound) {
            const role = guild.roles.cache.find((role) => {
                return role.name === 'wound'
            })

            if (role) {
                member.roles.add(role)
            }
        }
    })
}

