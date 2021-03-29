require('module-alias/register')
require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();
const mongo = require('@db/mongo')

//bot core
const loadCommands = require('@root/commands/load-commands')
const loadFeatures = require('@root/features/load-features')

//extra
const announcement = require('@util/announcement/announcement')

//increase event emitter
const EventEmitter = require('events')
EventEmitter.defaultMaxListeners = 50;

//Commando framework
// const path = require('path')
// const Commando = require('discord.js-commando')
// const client = new Commando.CommandoClient({
//     owner: '361133453217103875',
//     commandPrefix: config.prefix
// })



client.on('ready', async () => {
    //set new bot name
    // client.user.setUsername("Violet Evergarden");
    // client.user.setAvatar('https://i.imgur.com/BvRYDkz.jpg');

    // client.user.setUsername("Vns-bot");
    // client.user.setAvatar('');

    //Commando framework
    // client.registry
    //     .registerGroups([
    //         ['misc', 'Misc commands'],
    //         ['moderation', 'Moderation commands'],
    //         ['economy', 'Commands for economy sys']
    //     ])
    //     .registerDefaults()
    //     .registerCommandsIn(path.join(__dirname, 'cmds'))

    //check if bot is ready
    console.log('bot ready')

    //open connection to db
    await mongo()

    //old cmds
    loadCommands(client)
    loadFeatures(client)

    // announcement(client, '824984675972939826')

});

client.on('message', (message) => {

    if (message.mentions.has(client.user)) {

        const lres = [
            '<:worrysad:752870820442931260>',
            '<:worrynope:752870787769303151>',
            '<:worrysleep:752870932208680993>'
        ]

        const greets = ['iu'];
        const input = message.content;

        if (message.member.roles.cache.some(role => role.name === 'v4v')) {
            if (greets.some(greet => input.includes(greet))) {
                message.channel.messages.fetch().then((result) => {
                    message.channel.send(`<:Love:553783096852611078> <@${message.author.id}>`)
                })
            } else {
                // message.channel.send(`Chào mọi người https://i.imgur.com/zrvO1Oa.jpg`)
                // message.channel.send(`Chào mọi người`)
            }
        } else {
            message.channel.send(lres[Math.floor(Math.random() * lres.length)]);
        }
    }

});

client.login(process.env.BOT_TOKEN);
