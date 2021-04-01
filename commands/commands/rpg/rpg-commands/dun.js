const Discord = require('discord.js');
const economy = require('@features/economy')
const hpFeature = require('@features/hp')
const xpFeature = require('@features/level')
const story1p = require('@root/json/1p/rpg-1p.json')
const core = require('@core/core')
const profileSchema = require('@schema/profile-schema');

module.exports = {
    commands: ['dun'],
    expectedArgs: "Rỗng",
    permissionError: 'Bạn phải là adventure để sử dụng lệnh này',
    description: "Thám hiểm dungeon",
    requiredRoles: ['adventure'],
    cooldown: 5,
    callback: async (message) => {

        let story = story1p.story;
        story = core.getStory(story)
        if (!story) return message.reply('Không tìm thấy story')

        const { guild, member } = message
        const { id } = member
        const guildId = guild.id
        const userId = id
        const userProfile = await profileSchema.findOne({ guildId, userId })
        const userLvl = userProfile.level

        //Check if user is wounded
        if (member.roles.cache.some(role => role.name === 'wound')) return message.reply('Bạn đang hồi sức, không sử dụng lệnh được')

        //check if self exists or is in an interaction
        const status = await core.checkAvailabilityWithToken(message, userProfile)
        if (!status) return

        //core
        const filter = response => {
            let countL = 0;
            if (response.author.id === userId) {
                return story.conflict.map(() => countL += 1).some(answer => answer === parseInt(response.content.replace(/[^0-9]/g, '')));
            }
        };

        //story builder
        let text = `${story.plot}\n`
        story.conflict.forEach(item => {
            text += `${item.action}\n`
        })

        if (text.includes('player1')) text = text.replace(/player1/g, `<@${userId}>`)
        let img = story.img
        const embedPlot = new Discord.MessageEmbed()
            .setThumbnail(img)
            .setDescription(text)
            .setColor(`#FFFDC0`)

        message.channel.send(embedPlot).then(async () => {

            //set player availability to false
            await profileSchema.findOneAndUpdate({ guildId, userId }, { availability: false }, { upsert: true })

            message.channel.awaitMessages(filter, { max: 1, time: 1000 * 60, errors: ['time'] })
                .then(async collected => {

                    const action = collected.first().content
                    const resolution = core.getStory(story.conflict[action - 1].resolution)
                    const resWeight = await core.calWeight(resolution.weight, userLvl)
                    let endTxt = `Bạn có thêm ${userLvl + 1.5 / userLvl}% cơ hội thành công.`
                    let result = resolution.gain[0].player1
                    let extraTxt = resolution.gain[0].extra
                    if (!resWeight) {
                        result = resolution.loss[0].player1
                        extraTxt = resolution.loss[0].extra
                    }

                    let { coins, xp, hp } = result
                    coins = core.checkGainArray(coins)
                    xp = core.checkGainArray(xp)
                    hp = core.checkGainArray(hp)

                    let text = `${resolution.plot}\n ${extraTxt}\n`
                    text = text.replace(/player1/g, `<@${userId}>`);
                    text += `Bạn nhận được :yen: ${coins} tiền, :cross: ${xp} xp, mất :drop_of_blood: ${hp} máu.\n`

                    const promises = [
                        await hpFeature.addHP(guildId, userId, hp),
                        await economy.addCoins(guildId, userId, coins),
                        await xpFeature.addXP(guildId, userId, xp),
                        await profileSchema.findOneAndUpdate({ guildId, userId }, { availability: true }, { upsert: true })
                    ]

                    Promise.all(promises)
                        .then(async (results) => {
                            if (results[0] == 0) {
                                text += `Bạn đã hết máu. Hồi sức trong 20 phút!`
                                await economy.addWound(guild, guildId, userId, 20)
                            }

                            // const itemDB = {
                            //     name: 'token',
                            //     quantity: -1
                            // }
                            // await economy.addItem(guildId, userId, itemDB)

                            let embedResolution = new Discord.MessageEmbed()
                                .setDescription(text)
                                .setColor(`#FFFDC0`)
                                .setTimestamp()
                                .setFooter(endTxt, 'https://i.imgur.com/pmDv6Hb.png');
                            message.channel.send(embedResolution)
                        })
                        .catch(async (err) => {
                            message.reply('Bị lỗi, Violet chưa biết xử lý làm sao hết!')
                            console.log('promise err ', err)
                        });
                    return
                })
                .catch(async (err) => {
                    console.log('msg catch err ', err)
                    message.reply('Không thấy câu trả lời của người chơi.')
                    await profileSchema.findOneAndUpdate({ guildId, userId }, { availability: true }, { upsert: true })
                });
        })

    }
}