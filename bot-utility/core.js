const changeBotStatus = (client, message) => {
    const content = message.content.replace('!p ', '')
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

module.exports = {
    changeBotStatus,
    sendMessage
}