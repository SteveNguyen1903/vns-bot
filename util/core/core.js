const profileSchema = require('@schema/profile-schema')

//change bot status
const changeBotStatus = (client, message) => {
    const content = message.content.replace('!pstatus ', '')
    client.user.setPresence({
        activity: {
            name: content,
            type: 0
        }
    })
}

//send and delete message
const sendMessage = (channel, text, duration = 10) => {
    channel.send(text).then(message => {
        if (duration === -1) return

        setTimeout(() => {
            message.delete()
        }, 1000 * duration);
    })
}

//random generator, pick one value in an array
const randomGen = (arr) => {
    return item = arr[Math.floor(Math.random() * arr.length)];
}

//self check availability with token
const checkAvailabilityWithToken = async (message, selfAvailability) => {
    if (!selfAvailability) {
        await profileSchema.findOneAndUpdate({
            guildId,
            userId
        }, {
            availability: true
        }, { upsert: true, new: true })
    }
    if (selfAvailability && !selfAvailability.availability) {
        message.reply('Bạn đang trong một sự kiện diễn ra, không thể dùng lệnh. Hãy hoàn thành tương tác này để tiếp tục!')
        return false
    }
    if (selfAvailability.items.token <= 0) {
        message.reply(`Thiếu item "token" để thực hiện tương tác.`)
        return false
    }
    return true
}

const calWeight = (weight, level) => {
    let bonusChance = level + 1.5 / level
    let success = 100 - (20 + (weight - 1) * 7.5) + bonusChance
    return success.toFixed(2)
}

//export core functions
module.exports = {
    changeBotStatus,
    sendMessage,
    randomGen,
    checkAvailabilityWithToken,
    calWeight
}