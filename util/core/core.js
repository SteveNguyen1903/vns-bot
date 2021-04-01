/* eslint-disable no-undef */
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

const maxMin = (max, min) => Math.floor(Math.random() * (max - min + 1)) + min;

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
    const item = arr[Math.floor(Math.random() * arr.length)];
    return item
}

//self check availability with token
const checkAvailabilityWithToken = async (message, userProfile) => {
    let guildId = userProfile.guildId
    let userId = userProfile.userId
    if (!userProfile) {
        await profileSchema.findOneAndUpdate({
            guildId,
            userId
        }, {
            availability: true
        }, { upsert: true, new: true })
    }
    if (userProfile && !userProfile.availability) {
        message.reply('Bạn đang trong một sự kiện diễn ra, không thể dùng lệnh. Hãy hoàn thành tương tác này để tiếp tục!')
        return false
    }
    if (userProfile.items.token <= 0) {
        message.reply(`Thiếu item "token" để thực hiện tương tác.`)
        return false
    }
    return true
}

const calWeight = (weight, level) => {
    let bonusChance = level + 1.5 / level
    let success = ((12.5 + (weight - 1) * 7.5) + bonusChance).toFixed(2)
    let result = Math.random() * 100
    result = parseFloat(result).toFixed(2);
    if (success > result) return true
    return false
}

const calWeightMany = (weight = []) => {
    let total = weight.reduce((a, b) => a + b)
    let result = Math.random()
    let tempChance = []
    weight.forEach(item => {
        tempChance.push(item / total)
    })
    let count = 0
    for (let i = 0; i < tempChance.length; i++) {
        count += tempChance[i]
        if (count >= result) return i
    }
}

const getStory = (story) => {
    let tempArr = []
    story.forEach(element => {
        tempArr.push(element.weight)
    });
    return story = story[(calWeightMany(tempArr))]
}

const checkGainArray = (arr) => {
    if (arr.length > 1) {
        const [max, min] = arr
        return maxMin(max, min)
    }
    return arr[0]
}

const calLvlRes = (userLvl, targetLvl) => {
    let result = Math.random() * 100
    result = parseFloat(result).toFixed(2);
    const diff = (userLvl + 1.5 / userLvl) - (targetLvl + 1.5 / targetLvl)
    const userResult = 50 + diff
    if (userResult > result) return true
    return false
}

//export core functions
module.exports = {
    changeBotStatus,
    sendMessage,
    randomGen,
    checkAvailabilityWithToken,
    calWeight,
    calWeightMany,
    getStory,
    maxMin,
    checkGainArray,
    calLvlRes
}

