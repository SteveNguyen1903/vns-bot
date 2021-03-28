const mongo = require('@db/mongo')
const economy = require('@features/economy')
const level = require('@features/level')
const dailyRewardsSchema = require('@schema/daily-rewards-schema')
const Discord = require('discord.js');

//cache
let claimedCache = []

const clearCache = () => {
    claimedCache = []
    setTimeout(clearCache, 1000 * 60 * 10) // 10 minutes
}
clearCache()

//second to hms
const secondsToHms = (d) => {
    d = Number(d);

    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    return ('0' + h).slice(-2) + ":" + ('0' + m).slice(-2) + ":" + ('0' + s).slice(-2);
}

//daily rewards
const randomRewards = (max, min) => Math.floor(Math.random() * (max - min + 1)) + min;

//getneeded exp
const getNeededXP = level => level * level * 100

const alreadyClaimed = 'Bạn đã nhận thưởng nhiệm vụ rồi'

//main
module.exports = {
    commands: ['daily'],
    expectedArgs: "None",
    permissionError: 'Bạn phải là adventure để có thể sử dụng lệnh này',
    description: "Reaction",
    requiredRoles: ['adventure'],
    cooldown: 5,
    callback: async (message, arguments) => {

        const { guild, member } = message
        const { id } = member

        if (claimedCache.includes(id)) {
            // console.log('Returning from cache')
            message.reply(alreadyClaimed)
            return
        }

        const obj = {
            guildId: guild.id,
            userId: id,
        }

        await mongo().then(async (mongoose) => {
            try {
                const results = await dailyRewardsSchema.findOne(obj)
                // console.log('RESULTS:', results)
                if (results) {
                    const then = new Date(results.updatedAt).getTime()
                    const now = new Date().getTime()

                    const diffTime = Math.abs(now - then)
                    const diffDays = diffTime / (1000 * 60 * 60 * 24)

                    if (diffDays <= 0.5) {
                        claimedCache.push(id)
                        message.reply(`${alreadyClaimed}, nhiệm vụ sẽ hồi lại trong :stopwatch: ${secondsToHms((86400000 - diffTime) / (1000 * 2))}`)
                        // .then(msg => msg.delete({ timeout: 10000 }));
                        return
                    }
                }

                await dailyRewardsSchema.findOneAndUpdate(obj, obj, {
                    upsert: true,
                })

                claimedCache.push(id)

                //Give the rewards
                const randomCoins = randomRewards(200, 400)
                const newCoins = await economy.addCoins(obj.guildId, obj.userId, randomCoins)
                const newLevel = await level.addXP(obj.guildId, obj.userId, 50)

                const embed = new Discord.MessageEmbed()
                    .setColor(`#b5b5b5`)
                    .setDescription(`Bạn nhận được :yen: ${randomCoins}. Bạn đang sở hữu :yen: ${newCoins}\nBạn nhận được 50 exp. **Level ${newLevel.level}**, để lên level tiếp theo cần :cross: ${getNeededXP(newLevel.level) - newLevel.xp} XP`)

                message.channel.send(embed)

            } finally {
                mongoose.connection.close()
            }
        })

    }
}