require('module-alias/register')

const Discord = require('discord.js');
const client = new Discord.Client();
const loadCommands = require('@root/commands/load-commands')
const loadFeatures = require('@root/features/load-features')
const config = require('@root/config.json')
// const level = require('./level')
const role = require('@util/role-claim')
const announcement = require('@util/announcement/announcement')
require('dotenv').config();



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

    //check if bot is ready
    console.log('bot ready')

    //Commando framework
    // client.registry
    //     .registerGroups([
    //         ['misc', 'Misc commands'],
    //         ['moderation', 'Moderation commands'],
    //         ['economy', 'Commands for economy sys']
    //     ])
    //     .registerDefaults()
    //     .registerCommandsIn(path.join(__dirname, 'cmds'))

    //old cmds
    loadCommands(client)
    loadFeatures(client)

    //add roles
    role(client)
    announcement(client, '825041229439041568')
    // level(client)

    // client.channels.get('CHANNEL ID').send('Hello here!');


});

// Adding jokes function
const jokes = [
    'I went to a street where the houses were numbered 8k, 16k, 32k, 64k, 128k, 256k and 512k. It was a trip down Memory Lane.',
    '“Debugging” is like being the detective in a crime drama where you are also the murderer.',
    'The best thing about a Boolean is that even if you are wrong, you are only off by a bit.',
    'A programmer puts two glasses on his bedside table before going to sleep. A full one, in case he gets thirsty, and an empty one, in case he doesn’t.',
    'If you listen to a UNIX shell, can you hear the C?',
    'Why do Java programmers have to wear glasses? Because they don’t C#.',
    'What sits on your shoulder and says “Pieces of 7! Pieces of 7!”? A Parroty Error.',
    'When Apple employees die, does their life HTML5 in front of their eyes?',
    'Without requirements or design, programming is the art of adding bugs to an empty text file.',
    'Before software can be reusable it first has to be usable.',
    'The best method for accelerating a computer is the one that boosts it by 9.8 m/s2.',
    'I think Microsoft named .Net so it wouldn’t show up in a Unix directory listing'
];



client.on('message', (message) => { //this event is fired, whenever the bot sees a new message

    //console.log test
    // if (message.channel.id == '816865305807814676') {
    //     console.log('message ', message)
    // }

    if (message.mentions.has(client.user)) { //we check, whether the bot is mentioned, client.user returns the user that the client is logged in as
        //this is where you put what you want to do now

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
