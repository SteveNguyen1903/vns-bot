const firstMessage = require('@util/first-message')

module.exports = (client) => {
    const channelId = '824984704385810492'


    const getEmoji = (emojiName) => client.emojis.cache.get((emoji) => { emoji.name === emojiName })

    const emojis = {
        '⚔️': "adventure",
    }

    const reactions = []
    let emojiText = 'React để chọn role \n\n'
    for (const key in emojis) {
        // const emoji = getEmoji(key)
        reactions.push(key)
        const role = emojis[key]
        emojiText += `${key} = ${role}\n`
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