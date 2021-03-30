const changeBotStatus = (client, message) => {
    const content = message.content.replace('!pstatus ', '')
    client.user.setPresence({
        activity: {
            name: content,
            type: 0
        }
    })
}

const sendMessage = (channel, text, duration = 10) => {
    channel.send(text).then(message => {
        if (duration === -1) return

        setTimeout(() => {
            message.delete()
        }, 1000 * duration);
    })
}

const randomGen = (arr) => {
    return item = arr[Math.floor(Math.random() * arr.length)];
}

module.exports = {
    changeBotStatus,
    sendMessage,
    randomGen
}