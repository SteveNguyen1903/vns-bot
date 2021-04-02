const profileSchema = require('@schema/profile-schema')
const economy = require('@features/economy')
const Discord = require('discord.js');
const core = require('@core/core')

const maxMin = (max, min) => Math.floor(Math.random() * (max - min + 1)) + min;

const checkTime = (m) => {
    const createdTime = new Date(m.createdTimestamp).getTime()
    const now = new Date().getTime()
    const diffTime = Math.abs(now - createdTime)
    const diffMins = Math.round(diffTime / (1000 * 60))

    //test purpose
    if (diffMins <= 100000) {
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


        const availParticipants = await profileSchema.find({ userId: { $in: tempParticipants } });

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

        //Check if there are any participant
        if (!participantReady.length) {
            return message.reply('Hiện không có ai')
        }

        //Continue MAIN
        const targetId = participantReady[Math.floor(Math.random() * participantReady.length)]

        let plots = [
            {
                question: `<@${userId}> đang làm nhiệm vụ thì bị một người lạ mặt truy sát. Bị dồn vào đường cùng, <@${userId}> sử dụng token để kêu cứu.\n<@${targetId}> gần đấy nghe thấy, quyết định: (60s)\n1. Giúp đỡ\n2. Làm lơ\n3. Bắt tay cùng kẻ lạ mặt`,
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
            .setColor(`#FFFDC0`)

        message.channel.send(embedPlot).then(async () => {

            await profileSchema.findOneAndUpdate({ guildId, userId: targetId }, { availability: false }, { upsert: true })
            await profileSchema.findOneAndUpdate({ guildId, userId }, { availability: false }, { upsert: true })

            //test purposes
            const itemDB = {
                name: 'token',
                quantity: -1
            }
            await economy.addItem(guildId, userId, itemDB)

            message.channel.awaitMessages(filter, { max: 1, time: 1000 * 60, errors: ['time'] })
                .then(async collected => {

                    await profileSchema.findOneAndUpdate({ guildId, userId: targetId }, { availability: true }, { upsert: true })
                    await profileSchema.findOneAndUpdate({ guildId, userId }, { availability: true }, { upsert: true })

                    const action = collected.first().content

                    if (action == '1') {

                        let chance = Math.random()
                        let coins = maxMin(200, 100)
                        //failed
                        if (chance < 0.5) {
                            const embedPlot = new Discord.MessageEmbed()
                                .setDescription(`<@${targetId}> nổi máu anh hùng, xông lên ứng cứu. Nhưng tiếc rằng kẻ địch quá mạnh, một cân hai không đổ lấy một giọt mồ hôi. <@${targetId}> lẫn <@${userId}> bị cướp mất :yen: ${coins}, cả hai dưỡng thương 1 phút.`)
                                .setColor(`#FFFDC0`)
                            message.channel.send(embedPlot)
                            await economy.addWound(guild, guildId, userId, 1)
                            await economy.addWound(guild, guildId, targetId, 1)
                            await economy.addCoins(guildId, userId, coins * -1)
                            await economy.addCoins(guildId, targetId, coins * -1)
                            return
                        }

                        //success
                        if (chance > 0.5) {
                            const embedPlot = new Discord.MessageEmbed()
                                .setDescription(`<@${targetId}> xông pha giúp đỡ. Cả hai phối hợp ăn ý đánh bật tên địch truy sát, giành lấy :yen: ${coins} từ hắn. Cả hai hồi sức trong 1 phút.`)
                                .setColor(`#FFFDC0`)
                            message.channel.send(embedPlot)
                            await economy.addWound(guild, guildId, userId, 1)
                            await economy.addWound(guild, guildId, targetId, 1)
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
                                .setDescription(`<@${targetId}> thấy chết không cứu, cứ nghĩ chắc nó chừa mình ra. Xui thay, tên địch xử xong <@${userId}> quay sang đánh luôn <@${targetId}>, cả hai đều mất :yen: ${coins} và dưỡng thương 1 phút.`)
                                .setColor(`#FFFDC0`)
                            message.channel.send(embedPlot)
                            await economy.addWound(guild, guildId, userId, 1)
                            await economy.addWound(guild, guildId, targetId, 1)
                            await economy.addCoins(guildId, userId, coins * -1)
                            await economy.addCoins(guildId, targetId, coins * -1)
                            return
                        }

                        //success
                        if (chance > 0.5) {
                            const embedPlot = new Discord.MessageEmbed()
                                .setDescription(`<@${targetId}> thấy chết không cứu, cứ nghĩ chắc nó chừa mình ra. Xui thay, tên địch xử xong <@${userId}> quay sang đánh luôn <@${targetId}>. Nhưng mà kẻ địch đã chọn nhầm người rồi. <@${targetId}> kiên cường chống lại, giành lấy :yen: ${coins} từ tay địch. Cả 2 hồi sức trong 1 phút`)
                                .setColor(`#FFFDC0`)
                            message.channel.send(embedPlot)
                            await economy.addWound(guild, guildId, userId, 1)
                            await economy.addWound(guild, guildId, targetId, 1)
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
                                .setDescription(`<@${targetId}> nổi ý định xấu, cấu kết với kẻ truy sát hội đồng <@${userId}>. Xui thay, trong lúc bị dồn vào đường cùng, bản tính sinh tồn nổi lên, <@${userId}> chống trả quyết liệt cân luôn cả 2 tên. <@${userId}> giành lấy :yen: ${coins} từ <@${targetId}> và hồi sức 1 phút. Này thì bẩn này! <@${targetId}> vừa mất tiền vừa tức tưởi vào nhà thương dưỡng sức 1 phút.`)
                                .setColor(`#FFFDC0`)
                            message.channel.send(embedPlot)
                            await economy.addWound(guild, guildId, userId, 1)
                            await economy.addWound(guild, guildId, targetId, 1)
                            await economy.addCoins(guildId, userId, coins * 1)
                            await economy.addCoins(guildId, targetId, coins * -1)
                            return
                        }

                        //success
                        if (chance > 0.5) {
                            const embedPlot = new Discord.MessageEmbed()
                                .setDescription(`<@${targetId}> nổi ý định xấu, cấu kết với kẻ truy sát hội đồng <@${userId}>. <@${userId}> sức yếu không thể chống trả, bị cướp :yen: ${coins}. Cả 2 hồi sức trong 1 phút`)
                                .setColor(`#FFFDC0`)
                            message.channel.send(embedPlot)
                            await economy.addWound(guild, guildId, userId, 1)
                            await economy.addWound(guild, guildId, targetId, 1)
                            await economy.addCoins(guildId, userId, coins * -1)
                            await economy.addCoins(guildId, targetId, coins * 1)
                            return
                        }

                    }

                })
                .catch(async () => {

                    await profileSchema.findOneAndUpdate({ guildId, userId: targetId }, { availability: true }, { upsert: true })
                    await profileSchema.findOneAndUpdate({ guildId, userId }, { availability: true }, { upsert: true })

                    let chance = Math.random()
                    let coins = maxMin(200, 100)
                    //failed
                    if (chance < 0.5) {
                        const embedPlot = new Discord.MessageEmbed()
                            .setDescription(`<@${targetId}> thấy chết không cứu, cứ nghĩ chắc nó chừa mình ra. Xui thay, tên địch xử xong <@${userId}> quay sang đánh luôn <@${targetId}>, cả hai đều mất :yen: ${coins} và dưỡng thương 1 phút.`)
                            .setColor(`#FFFDC0`)
                        message.channel.send(embedPlot)
                        // await economy.addWound(guild, guildId, userId, 1)
                        // await economy.addWound(guild, guildId, targetId, 1)
                        await economy.addCoins(guildId, userId, coins * -1)
                        await economy.addCoins(guildId, targetId, coins * -1)
                        return
                    }

                    //success
                    if (chance > 0.5) {
                        const embedPlot = new Discord.MessageEmbed()
                            .setDescription(`<@${targetId}> thấy chết không cứu, cứ nghĩ chắc nó chừa mình ra. Xui thay, tên địch xử xong <@${userId}> quay sang đánh luôn <@${targetId}>. Nhưng mà kẻ địch đã chọn nhầm người rồi. <@${targetId}> kiên cường chống lại, giành lấy :yen: ${coins} từ tay địch. Cả 2 hồi sức trong 1 phút`)
                            .setColor(`#FFFDC0`)
                        message.channel.send(embedPlot)
                        // await economy.addWound(guild, guildId, userId, 1)
                        // await economy.addWound(guild, guildId, targetId, 1)
                        await economy.addCoins(guildId, userId, coins * -1)
                        await economy.addCoins(guildId, targetId, coins * 1)
                        return
                    }

                });
        });
        // message.channel.send(`<@${id}> đã chọc <@${tempParticipants[Math.floor(Math.random() * tempParticipants.length)]}>`)
    }
}