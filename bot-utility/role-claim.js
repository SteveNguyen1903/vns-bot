const firstMessage = require('./first-message')

module.exports = (client) => {
    const channelId = '816869798436274218'

    const getEmoji = (emojiName) => client.emojis.cache.find((emoji) => { emoji.name === emojiName })


    // const getEmoji = client.emojis.find(emoji => emoji.name === "ayy")

    const emojis = {
        'gudako_drunk': "VnsFGO",
        'kyarupoint': "veteran",
        'ak_lappdumb': 'Dokutah',
        'dumbpipi': 'Genshin Impact'
    }

    const reactions = []
    let emojiText = 'React để chọn role \n\n'
    for (const key in emojis) {
        const emoji = getEmoji(key)

        reactions.push(emoji)

        const role = emojis[key]
        emojiText += `${emoji} = ${role}\n`
    }

    firstMessage(client, channelId, emojiText, reactions)

    const handleReaction = (reaction, user, add) => {
        if (user.id === '816862038532948008') { return }

        const emoji = reaction._emoji.name

        const { guild } = reaction.message

        const roleName = emojis[emoji]
        if (!roleName) return

        const role = guild.roles.cache.find(role => role.name === roleName)
        const member = guild.members.cache.find(member => member.id === user.id)

        if (add) {
            member.roles.add(role)
        } else {
            member.roles.remove(role)
        }

    }

    //user react to reaction
    client.on('messageReactionAdd', (reaction, user) => {
        if (reaction.message.channel.id === channelId) {
            handleReaction(reaction, user, true)
        }
    })

    //user react to remove
    client.on('messageReactionRemove', (reaction, user) => {
        if (reaction.message.channel.id === channelId) {
            handleReaction(reaction, user, false)
        }
    })
}