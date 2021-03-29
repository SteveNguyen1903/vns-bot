const mongo = require('@db/mongo')
const profileSchema = require('@schema/profile-schema')
const woundSchema = require('@schema/wound-schema')
const economy = require('@features/economy')
const Discord = require('discord.js');

const maxMin = (max, min) => Math.floor(Math.random() * (max - min + 1)) + min;

const checkTime = (m) => {
    const createdTime = new Date(m.createdTimestamp).getTime()
    const now = new Date().getTime()
    const diffTime = Math.abs(now - createdTime)
    const diffMins = Math.round(diffTime / (1000 * 60))

    if (diffMins <= 15) {
        return m
    }
}

module.exports = {
    commands: ['react'],
    minArgs: 0,
    maxArgs: 0,
    expectedArgs: "Không",
    permissionError: 'Bạn phải là adventure để sử dụng lệnh này',
    description: "Tương tác với người chơi khác",
    requiredRoles: ['adventure'],
    cooldown: 5,
    callback: async (message, arguments) => {

        const { guild, member } = message
        const { id } = member

        const guildId = guild.id
        const userId = id

        //check if self exists or is in an interaction
        // const selfAvailability = await mongo().then(async (mongoose) => {
        //     try {
        //         let res = await profileSchema.findOne({ userId: userId })
        //         if (!res) {
        //             let res = await profileSchema.findOneAndUpdate({
        //                 guildId,
        //                 userId
        //             }, {
        //                 availability: true
        //             }, { upsert: true, new: true })
        //             res = res
        //         }
        //         return res
        //     } finally {
        //         mongoose.connection.close()
        //     }
        // })
        const selfAvailability = await profileSchema.findOne({ userId: userId })
        if (!selfAvailability) {
            await profileSchema.findOneAndUpdate({
                guildId,
                userId
            }, {
                availability: true
            }, { upsert: true, new: true })
        }


        if (selfAvailability && !selfAvailability.availability) return message.reply('Bạn đang trong một sự kiện diễn ra, không thể dùng lệnh. Hãy hoàn thành tương tác này để tiếp tục!')
        if (selfAvailability.items.token <= 0) return message.reply(`Thiếu item "token" để thực hiện tương tác.`)

        //get participants and filter time
        let messages = await message.channel.messages.fetch({ limit: 50 });
        const messagesFilter = messages.filter(checkTime)

        //filter participants
        let tempParticipants = []

        messagesFilter.forEach(item => {
            const adventure = message.guild.roles.cache.find(r => r.name == 'adventure')
            adventure.members.forEach(user => {
                if (item.author.id === user.id) tempParticipants.push(item.author.id)
            });
        });

        const wound = message.guild.roles.cache.find(r => r.name == 'wound')
        wound.members.forEach(user => {
            tempParticipants = tempParticipants.filter(e => e !== user.id)
        });

        //get unique participants
        tempParticipants = [...new Set(tempParticipants)]
        tempParticipants = tempParticipants.filter(e => e !== id && e !== '816862038532948008')


        const availParticipants = await mongo().then(async (mongoose) => {
            try {
                const results = await profileSchema.find({ userId: { $in: tempParticipants } });

                let notExistInDB = []
                let inDB = []
                let participantReady = []

                results.forEach(participant => {

                    inDB.push(participant.userId)

                    if (participant.availability) participantReady.push(participant.userId)

                })

                notExistInDB = tempParticipants.filter(function (obj) { return inDB.indexOf(obj) == -1; });

                //insert new profile if not existed
                let newProfiles = []
                if (notExistInDB.length) {
                    notExistInDB.forEach(async user => {
                        let result = profileSchema.findOneAndUpdate({
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

                // console.log('participantReady ', participantReady)
                return participantReady
            } finally {
                mongoose.connection.close()
            }
        })

        //Check if user is wounded
        if (member.roles.cache.some(role => role.name === 'wound')) return message.reply('Bạn đang hồi sức, không sử dụng lệnh được')

        //Check if there are any participant
        if (!availParticipants.length) {
            return message.reply('Hiện không có ai')
        }

        //Continue MAIN
        console.log('availParticipants ', availParticipants)
        const targetId = availParticipants[Math.floor(Math.random() * availParticipants.length)]

        console.log('userId: ', userId, 'targetId: ', targetId)

        let plots = [
            {
                question: `<@${userId}> đang làm nhiệm vụ thì bị một người lạ mặt truy sát. Bị dồn vào đường cùng, <@${userId}> sử dụng token để kêu cứu.
                <@${targetId}> gần đấy nghe thấy, quyết định: (60s)\n
                1. Giúp đỡ
                2. Làm lơ
                3. Bắt tay cùng kẻ lạ mặt`,
                answers: [1, 2, 3]
            }
        ];

        const plot = plots[Math.floor(Math.random() * plots.length)];

        const filter = response => {
            if (response.author.id === targetId) {
                return plot.answers.some(answer => answer === parseInt(response.content.replace(/[^0-9]/g, '')));
            }
        };

        const embedPlot = new Discord.MessageEmbed()
            .setDescription(`${plot.question}`)
            .setColor(`#b5b5b5`)

        message.channel.send(embedPlot).then(async () => {

            await mongo().then(async (mongoose) => {
                try {
                    await profileSchema.findOneAndUpdate({ guildId, userId: targetId }, { availability: false }, { upsert: true })
                    await profileSchema.findOneAndUpdate({ guildId, userId }, { availability: false }, { upsert: true })
                } finally {
                    mongoose.connection.close()
                }
            })

            const itemDB = {
                name: 'token',
                quantity: -1
            }

            await economy.addItem(guildId, userId, itemDB)

            message.channel.awaitMessages(filter, { max: 1, time: 1000 * 60, errors: ['time'] })
                .then(async collected => {

                    await mongo().then(async (mongoose) => {
                        try {
                            await profileSchema.findOneAndUpdate({ guildId, userId: targetId }, { availability: true }, { upsert: true })
                            await profileSchema.findOneAndUpdate({ guildId, userId }, { availability: true }, { upsert: true })
                        } finally {
                            mongoose.connection.close()
                        }
                    })

                    const action = collected.first().content

                    console.log('collected ', collected)

                    if (action == '1') {

                        let chance = Math.random()
                        let coins = maxMin(200, 100)
                        //failed
                        if (chance < 0.5) {
                            const embedPlot = new Discord.MessageEmbed()
                                .setDescription(`<@${targetId}> nổi máu anh hùng, xông lên ứng cứu. Nhưng tiếc rằng kẻ địch quá mạnh, một cân hai không đổ lấy một giọt mồ hôi. <@${targetId}> lẫn <@${userId}> bị cướp mất :yen: ${coins}, cả hai dưỡng thương 20 phút.`)
                                .setColor(`#b5b5b5`)
                            message.channel.send(embedPlot)
                            await economy.addWound(guild, guildId, userId, 20)
                            await economy.addWound(guild, guildId, targetId, 20)
                            await economy.addCoins(guildId, userId, coins * -1)
                            await economy.addCoins(guildId, targetId, coins * -1)
                            return
                        }

                        //success
                        if (chance > 0.5) {
                            const embedPlot = new Discord.MessageEmbed()
                                .setDescription(`<@${targetId}> xông pha giúp đỡ. Cả hai phối hợp ăn ý đánh bật tên địch truy sát, giành lấy :yen: ${coins} từ hắn. Cả hai hồi sức trong 20 phút.`)
                                .setColor(`#b5b5b5`)
                            message.channel.send(embedPlot)
                            await economy.addWound(guild, guildId, userId, 20)
                            await economy.addWound(guild, guildId, targetId, 20)
                            await economy.addCoins(guildId, userId, coins * 1)
                            await economy.addCoins(guildId, targetId, coins * 1)
                            return
                        }

                    }

                    if (action == '2') {

                        let chance = Math.random()
                        let coins = maxMin(200, 100)
                        //failed
                        if (chance < 0.5) {
                            const embedPlot = new Discord.MessageEmbed()
                                .setDescription(`<@${targetId}> thấy chết không cứu, cứ nghĩ chắc nó chừa mình ra. Xui thay, tên địch xử xong <@${userId}> quay sang đánh luôn <@${targetId}>, cả hai đều mất :yen: ${coins} và dưỡng thương 20 phút.`)
                                .setColor(`#b5b5b5`)
                            message.channel.send(embedPlot)
                            await economy.addWound(guild, guildId, userId, 20)
                            await economy.addWound(guild, guildId, targetId, 20)
                            await economy.addCoins(guildId, userId, coins * -1)
                            await economy.addCoins(guildId, targetId, coins * -1)
                            return
                        }

                        //success
                        if (chance > 0.5) {
                            const embedPlot = new Discord.MessageEmbed()
                                .setDescription(`<@${targetId}> thấy chết không cứu, cứ nghĩ chắc nó chừa mình ra. Xui thay, tên địch xử xong <@${userId}> quay sang đánh luôn <@${targetId}>. Nhưng mà kẻ địch đã chọn nhầm người rồi. <@${targetId}> kiên cường chống lại, giành lấy :yen: ${coins} từ tay địch. Cả 2 hồi sức trong 20 phút`)
                                .setColor(`#b5b5b5`)
                            message.channel.send(embedPlot)
                            await economy.addWound(guild, guildId, userId, 20)
                            await economy.addWound(guild, guildId, targetId, 20)
                            await economy.addCoins(guildId, userId, coins * -1)
                            await economy.addCoins(guildId, targetId, coins * 1)
                            return
                        }

                    }

                    if (action == '3') {

                        let chance = Math.random()
                        let coins = maxMin(200, 100)
                        //failed
                        if (chance < 0.5) {
                            const embedPlot = new Discord.MessageEmbed()
                                .setDescription(`<@${targetId}> nổi ý định xấu, cấu kết với kẻ truy sát hội đồng <@${userId}>. Xui thay, trong lúc bị dồn vào đường cùng, bản tính sinh tồn nổi lên, <@${userId}> chống trả quyết liệt cân luôn cả 2 tên. <@${userId}> giành lấy :yen: ${coins} từ <@${targetId}> và hồi sức 20 phút. Này thì bẩn này! <@${targetId}> vừa mất tiền vừa tức tưởi vào nhà thương dưỡng sức 20 phút.`)
                                .setColor(`#b5b5b5`)
                            message.channel.send(embedPlot)
                            await economy.addWound(guild, guildId, userId, 20)
                            await economy.addWound(guild, guildId, targetId, 20)
                            await economy.addCoins(guildId, userId, coins * 1)
                            await economy.addCoins(guildId, targetId, coins * -1)
                            return
                        }

                        //success
                        if (chance > 0.5) {
                            const embedPlot = new Discord.MessageEmbed()
                                .setDescription(`<@${targetId}> nổi ý định xấu, cấu kết với kẻ truy sát hội đồng <@${userId}>. <@${userId}> sức yếu không thể chống trả, bị cướp :yen: ${coins}. Cả 2 hồi sức trong 20 phút`)
                                .setColor(`#b5b5b5`)
                            message.channel.send(embedPlot)
                            await economy.addWound(guild, guildId, userId, 20)
                            await economy.addWound(guild, guildId, targetId, 20)
                            await economy.addCoins(guildId, userId, coins * -1)
                            await economy.addCoins(guildId, targetId, coins * 1)
                            return
                        }

                    }

                })
                .catch(async collected => {

                    console.log('error CATCH', collected)

                    await mongo().then(async (mongoose) => {
                        try {
                            await profileSchema.findOneAndUpdate({ guildId, userId: targetId }, { availability: true }, { upsert: true })
                            await profileSchema.findOneAndUpdate({ guildId, userId }, { availability: true }, { upsert: true })
                        } finally {
                            mongoose.connection.close()
                        }
                    })

                    let chance = Math.random()
                    let coins = maxMin(200, 100)
                    //failed
                    if (chance < 0.5) {
                        const embedPlot = new Discord.MessageEmbed()
                            .setDescription(`<@${targetId}> thấy chết không cứu, cứ nghĩ chắc nó chừa mình ra. Xui thay, tên địch xử xong <@${userId}> quay sang đánh luôn <@${targetId}>, cả hai đều mất :yen: ${coins} và dưỡng thương 20 phút.`)
                            .setColor(`#b5b5b5`)
                        message.channel.send(embedPlot)
                        await economy.addWound(guild, guildId, userId, 20)
                        await economy.addWound(guild, guildId, targetId, 20)
                        await economy.addCoins(guildId, userId, coins * -1)
                        await economy.addCoins(guildId, targetId, coins * -1)
                        return
                    }

                    //success
                    if (chance > 0.5) {
                        const embedPlot = new Discord.MessageEmbed()
                            .setDescription(`<@${targetId}> thấy chết không cứu, cứ nghĩ chắc nó chừa mình ra. Xui thay, tên địch xử xong <@${userId}> quay sang đánh luôn <@${targetId}>. Nhưng mà kẻ địch đã chọn nhầm người rồi. <@${targetId}> kiên cường chống lại, giành lấy :yen: ${coins} từ tay địch. Cả 2 hồi sức trong 20 phút`)
                            .setColor(`#b5b5b5`)
                        message.channel.send(embedPlot)
                        await economy.addWound(guild, guildId, userId, 20)
                        await economy.addWound(guild, guildId, targetId, 20)
                        await economy.addCoins(guildId, userId, coins * -1)
                        await economy.addCoins(guildId, targetId, coins * 1)
                        return
                    }

                });
        });
        // message.channel.send(`<@${id}> đã chọc <@${tempParticipants[Math.floor(Math.random() * tempParticipants.length)]}>`)
    }
}