const { prefix } = require('@root/config.json')

const validatePermissions = (permissions) => {
    const validPermissions = [
        'CREATE_INSTANT_INVITE',
        'KICK_MEMBERS',
        'BAN_MEMBERS',
        'ADMINISTRATOR',
        'MANAGE_CHANNELS',
        'MANAGE_GUILD',
        'ADD_REACTIONS',
        'VIEW_AUDIT_LOG',
        'PRIORITY_SPEAKER',
        'STREAM',
        'VIEW_CHANNEL',
        'SEND_MESSAGES',
        'SEND_TTS_MESSAGES',
        'MANAGE_MESSAGES',
        'EMBED_LINKS',
        'ATTACH_FILES',
        'READ_MESSAGE_HISTORY',
        'MENTION_EVERYONE',
        'USE_EXTERNAL_EMOJIS',
        'VIEW_GUILD_INSIGHTS',
        'CONNECT',
        'SPEAK',
        'MUTE_MEMBERS',
        'DEAFEN_MEMBERS',
        'MOVE_MEMBERS',
        'USE_VAD',
        'CHANGE_NICKNAME',
        'MANAGE_NICKNAMES',
        'MANAGE_ROLES',
        'MANAGE_WEBHOOKS',
        'MANAGE_EMOJIS',
    ]

    for (const permission of permissions) {
        if (!validPermissions.includes(permission)) {
            throw new Error(`Unknow permission ${permission}`)
        }
    }
}

let recentlyRan = []


module.exports = (client, commandOptions) => {
    let {
        commands,
        expectedArgs = '',
        permissionError = 'You do not have permission to run this command',
        minArgs = 0,
        maxArgs = null,
        cooldown = -1,
        requiredChannel = '',
        permissions = [],
        requiredRoles = [],
        callback
    } = commandOptions


    //ensure the command is an array
    if (typeof commands === 'string') {
        commands = [commands]
    }

    console.log(`Registering command ${commands[0]}`)

    //ensure the permission are in array and valid
    if (permissions.length) {
        if (typeof permissions === 'string') {
            permissions = [permissions]
        }

        validatePermissions(permissions)
    }


    //Listen for messages
    client.on('message', (message) => {
        const { member, content, guild, channel } = message

        for (const alias of commands) {
            if (content.toLowerCase().startsWith(`${prefix}${alias.toLowerCase()}`)) {
                // Comman runs

                // ensure we are in the right channel
                if (requiredChannel && requiredChannel !== channel.name) {
                    //<#ID>
                    const foundChannel = guild.channels.cache.find((channel) => {
                        return channel.name === requiredChannel
                    })
                    message.reply(
                        `You can only run this command inside of <#${foundChannel.id}>.`
                    )
                    return
                }

                //ensure the user has the permission
                for (const permission of permissions) {
                    if (!member.hasPermission(permission)) {
                        message.reply(permissionError)
                        return
                    }
                }

                //ensure the user has required roles
                for (const requiredRole of requiredRoles) {
                    const role = guild.roles.cache.find(role => role.name === requiredRole)

                    if (!role || !member.roles.cache.has(role.id)) {
                        message.reply(`You musts have the "${requiredRole}" role to use this command`)
                        return
                    }
                }
                // A command has been ran


                // Ensure the user has not ran this command too many times
                let cooldownString = `${guild.id}-${member.id}-${commands[0]}`
                if (cooldown > 0 && recentlyRan.includes(cooldownString)) {
                    message.reply('You cannot use that command so soon, please wait')
                    return
                }

                //split on any number of spaces
                const arguments = content.split(/[ ]+/)
                //remove the command in the first index
                arguments.shift()

                //ensure we have the correct number of args
                if (arguments.length < minArgs || (maxArgs !== null && arguments.length > maxArgs)) {
                    message.reply(`Incorrect syntax! Use ${prefix}${alias} ${expectedArgs}`)
                    return
                }

                if (cooldown > 0) {
                    recentlyRan.push(cooldownString)
                    setTimeout(() => {
                        recentlyRan = recentlyRan.filter((string) => {
                            return string !== cooldownString
                        })
                    }, 1000 * cooldown);
                }


                //handle the custom command
                callback(message, arguments, arguments.join(' '))

                return
            }
        }
    })
}