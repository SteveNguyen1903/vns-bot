
const Discord = require('discord.js');
const profileSchema = require('@schema/profile-schema')
const economy = require('@features/economy')
const hpFeature = require('@features/hp')
const xpFeature = require('@features/level')
const core = require('@core/core')
const story2p = require('@root/json/2p/rpg-2p.json')

const checkTime = (m) => {
    const createdTime = new Date(m.createdTimestamp).getTime()
    const now = new Date().getTime()
    const diffTime = Math.abs(now - createdTime)
    const diffMins = Math.round(diffTime / (1000 * 60))

    //test purpose
    if (diffMins <= 15) {
        return m
    }
}

module.exports = {
    commands: ['react', 'rt'],
    minArgs: 0,
    maxArgs: 0,
    expectedArgs: "Không",
    permissionError: 'Bạn phải là adventure để sử dụng lệnh này',
    description: "Tương tác với người chơi khác",
    requiredRoles: ['adventure'],
    cooldown: 5,
    callback: async (message) => {

        let story = core.getStory(story2p.story)
        if (!story) return message.reply('Không tìm thấy story')

        const { guild, member } = message
        const { id } = member
        const guildId = guild.id
        const userId = id
        const userProfile = await profileSchema.findOne({ guildId, userId })

        //Check if user is wounded
        if (member.roles.cache.some(role => role.name === 'wound')) return message.reply('Bạn đang hồi sức, không sử dụng lệnh được')

        //check if self exists or is in an interaction
        const status = await core.checkAvailabilityWithToken(message, userProfile)
        if (!status) return

        //get participants and filter time
        let messages = await message.channel.messages.fetch({ limit: 50 });
        const messagesFilter = messages.filter(checkTime)

        //filter participants
        let tempParticipants = []

        const adventure = message.guild.roles.cache.find(r => r.name == 'adventure')
        messagesFilter.forEach(item => {
            adventure.members.forEach(user => {
                if (item.author.id === user.id) tempParticipants.push(item.author.id)
            });
        });

        const wound = message.guild.roles.cache.find(r => r.name == 'wound')
        wound.members.forEach(user => {
            tempParticipants = tempParticipants.filter(e => e !== user.id)
        });

        //filter participants
        // tempParticipants = tempParticipants.filter(e => )
        tempParticipants = tempParticipants.filter(e => {
            const member = guild.members.cache.get(e)
            if (member.presence.status === 'online' && e !== userId && e !== '816862038532948008')
                return e
        })

        const availParticipants = await profileSchema.find({ guildId, userId: { $in: tempParticipants } });
        let notExistInDB = []
        let inDB = []
        let participantReady = []

        availParticipants.forEach(participant => {
            inDB.push(participant.userId)
            if (participant.availability) participantReady.push(participant.userId)

        })
        notExistInDB = tempParticipants.filter(function (obj) { return inDB.indexOf(obj) == -1; });

        //insert new profile if not existed
        let newProfiles = []
        if (notExistInDB.length) {
            notExistInDB.forEach(async user => {
                let result = await profileSchema.findOneAndUpdate({
                    guildId,
                    userId: user
                }, {
                    availability: true
                }, { upsert: true, new: true })
                newProfiles.push(result)
                participantReady.push(user)
            })
        }
        await Promise.all(newProfiles)

        //Check if there are any participant
        if (!participantReady.length) {
            return message.reply('Hiện không có ai')
        }

        //Continue MAIN
        //get targetId
        const targetId = participantReady[Math.floor(Math.random() * participantReady.length)]

        const filter = response => {
            let countL = 0;
            if (response.author.id === targetId) {
                return story.conflict.map(() => countL += 1).some(answer => answer === parseInt(response.content.replace(/[^0-9]/g, '')));
            }
        };

        //story builder
        let text = `${story.plot}\n`
        story.conflict.forEach(item => {
            text += `${item.action}\n`
        })

        if (text.includes('player1')) text = text.replace(/player1/g, `<@${userId}>`)
        if (text.includes('player2')) text = text.replace(/player2/g, `<@${targetId}>`)

        // let img = story.img
        // const embedPlot = new Discord.MessageEmbed()
        //     .setThumbnail(img)
        //     .setDescription(text)
        //     .setColor(`#FFFDC0`)

        // console.log('story ', story)

        message.channel.send(text).then(async () => {

            //set player availability to false
            await profileSchema.updateMany({ guildId, userId: { $in: [userId, targetId] } }, { availability: false })

            message.channel.awaitMessages(filter, { max: 1, time: 1000 * 60, errors: ['time'] })
                .then(async collected => {
                    await profileSchema.updateMany({ guildId, userId: { $in: [userId, targetId] } }, { availability: true })
                    const targetProfile = await profileSchema.findOne({ guildId, userId: targetId })
                    const action = collected.first().content
                    const resolution = core.getStory(story.conflict[action - 1].resolution)
                    const userRes = core.calLvlRes(userProfile.level, targetProfile.level)

                    let result = resolution.gain
                    if (!userRes) result = resolution.loss

                    const { extra, player1, player2 } = result[0]

                    const promises = [
                        await hpFeature.addHP(guildId, userId, core.checkGainArray(player1.hp)),
                        await hpFeature.addHP(guildId, targetId, core.checkGainArray(player2.hp)),
                        await profileSchema.bulkWrite([
                            {
                                updateOne: {
                                    filter: { userId: userId },
                                    update: {
                                        $inc: {
                                            coins: core.checkGainArray(player1.coins),
                                            "items.token": -1
                                        }
                                    },
                                }
                            },
                            {
                                updateOne: {
                                    filter: { userId: targetId },
                                    update: {
                                        $inc: {
                                            coins: core.checkGainArray(player2.coins)
                                        }
                                    },
                                },
                            }
                        ]),
                        await xpFeature.addXP(guildId, userId, core.checkGainArray(player1.xp)),
                        await xpFeature.addXP(guildId, targetId, core.checkGainArray(player2.xp))
                    ]

                    Promise.all(promises)
                        .then(async (results) => {

                            let text = ``

                            if (results[0] == 0) {
                                text += `player1 đã hết máu. Hồi sức trong 20 phút!`
                                await economy.addWound(guild, guildId, userId, 20)
                            }

                            if (results[1] == 0) {
                                text += `player2 đã hết máu. Hồi sức trong 20 phút!`
                                await economy.addWound(guild, guildId, targetId, 20)
                            }

                            text += `${resolution.plot}\n${extra}\n`
                            text += `Kết quả của player1 : :yen: ${core.checkGainArray(player1.coins)} tiền, :cross: ${core.checkGainArray(player1.xp)} xp, mất :drop_of_blood: ${core.checkGainArray(player1.hp)} máu.\n`
                            text += `Kết quả của player2 : :yen: ${core.checkGainArray(player2.coins)} tiền, :cross: ${core.checkGainArray(player2.xp)} xp, mất :drop_of_blood: ${core.checkGainArray(player2.hp)} máu.\n`
                            if (text.includes('player1')) text = text.replace(/player1/g, `<@${userId}>`)
                            if (text.includes('player2')) text = text.replace(/player2/g, `<@${targetId}>`)

                            const embedResPlot = new Discord.MessageEmbed()
                                .setDescription(text)
                                .setColor(`#FFFDC0`)

                            message.channel.send(embedResPlot)
                        })
                        .catch((err) => {
                            message.reply('Bị lỗi, Violet chưa biết xử lý làm sao hết!')
                            console.log('promise err ', err)
                        });
                    return

                })
                .catch(async (err) => {
                    const itemDB = { name: "token", quantity: 1 }
                    await economy.addItem(guildId, userId, itemDB)
                    await profileSchema.updateMany({ guildId, userId: { $in: [userId, targetId] } }, { availability: true })
                    message.reply('Không tìm thấy người trả lời! Bạn được hoàn lại token')
                    return
                });
        })

    }
}