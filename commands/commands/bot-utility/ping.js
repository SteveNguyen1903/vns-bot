const Discord = require('discord.js');
const client = new Discord.Client();

module.exports = {
    commands: 'ping',
    cooldown: 10,
    requiredChannel: 'bot-test',
    requiredRoles: ['Moderator'],
    callback: (message, arguments, text) => {
        message.reply('Calculating ping ...').then((resultMessage) => {
            const ping = resultMessage.createdTimestamp - message.createdTimestamp

            resultMessage.edit(`Bot latency: ${ping}, API latency: ${client.ws.ping}`)
            // console.log('creat time stamp ', resultMessage.createdAt)
        })
    }
}