
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
    commands: ['mess'],
    expectedArgs: "None",
    permissionError: 'You must be an admin to use this command',
    description: "Test message",
    permissions: 'ADMINISTRATOR',
    callback: async (message, arguments) => {

        const { guild, member } = message
        const { id } = member

        //get participants and filter time
        let messages = await message.channel.messages.fetch({ limit: 50 });
        const messagesFilter = messages.filter(checkTime)

        //filter participants
        let tempParticipants = []
        messagesFilter.forEach(item => {
            tempParticipants.push(item.author.id)
        });

        //get unique participants
        tempParticipants = [...new Set(tempParticipants)]
        tempParticipants = tempParticipants.filter(e => e !== id && e !== '816862038532948008')

        console.log('temp participants ', tempParticipants)
        message.channel.send(`<@${id}> đã chọc <@${tempParticipants[Math.floor(Math.random() * tempParticipants.length)]}>`)

    }
}