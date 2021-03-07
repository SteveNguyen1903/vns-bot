const Discord = require('discord.js');
const client = new Discord.Client();
require('dotenv').config();

const mongo = require('./mongo');
const command = require('./command');
const core = require('./bot-utility/core')
const firstMessage = require('./bot-utility/first-message')
const roleClaim = require('./bot-utility/role-claim')
const welcome = require('./bot-utility/welcome')
const anime = require('./bot-utility/animeSearch')

client.login(process.env.BOT_TOKEN);

client.on('ready', async () => {

    //set new bot name
    // client.user.setUsername("Violet Evergarden");
    // client.user.setAvatar('https://i.imgur.com/BvRYDkz.jpg');

    // client.user.setUsername("Vns-bot");
    // client.user.setAvatar('');

    //check if bot is ready
    console.log('bot ready localhost')
    command(client, 'ping', (message) => {
        message.channel.send('Pong!')
    })

    //mongo connection
    await mongo().then(mongoose => {
        try {
            console.log('connected to mongo')
        } catch (e) {

        } finally {
            //will always run
            mongoose.connection.close()
        }
    })

    //check server info
    command(client, 'server', (message) => {
        client.guilds.cache.forEach((guild) => {
            // console.log(guild)
        })
    })

    //set status
    command(client, 'status', (message) => {
        core.changeBotStatus(client, message)
    })

    //check string
    // command(client, 'test admin', (message) => {
    //     if (message.member.hasPermission('ADMINISTRATION')) {
    //         message.channel.messages.fetch().then((result) => {
    //             message.channel.send(`this user has ADMIN permission`)
    //         })
    //     }
    // })



    // const guild = client.guilds.cache.get('694183141170217080')
    // const channel = guild.channels.cache.get('816865305807814676')

    // core.sendMessage(channel, 'hello world', 3)

    //role reaction
    // roleClaim(client)

    //setwelcome
    // welcome(client)
    anime(client)
});

// Adding jokes function

// Jokes from dcslsoftware.com/20-one-liners-only-software-developers-understand/
// www.journaldev.com/240/my-25-favorite-programming-quotes-that-are-funny-too
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

        //has permission admin
        // if (message.member.hasPermission('ADMINISTRATION')) {
        //     if (greets.some(greet => input.includes(greet))) {
        //         message.channel.messages.fetch().then((result) => {
        //             message.channel.send(`admin permission`)
        //         })
        //     } else {
        //         message.channel.send(`not admin`)
        //     }
        // } else {
        //     message.channel.send(lres[Math.floor(Math.random() * lres.length)]);
        // }

        if (message.member.roles.cache.some(role => role.name === 'v4v')) {
            if (greets.some(greet => input.includes(greet))) {
                message.channel.messages.fetch().then((result) => {
                    message.channel.send(`<:Love:553783096852611078> <@${message.author.id}>`)
                })
            } else {
                message.channel.send(`Chào mọi người https://i.imgur.com/zrvO1Oa.jpg`)
            }
        } else {
            message.channel.send(lres[Math.floor(Math.random() * lres.length)]);
        }

    }
});


client.on('message', (msg) => {
    if (msg.content === '?joke') {
        msg.channel.send(jokes[Math.floor(Math.random() * jokes.length)]);
    }
});


// Adding reaction-role function
client.on('messageReactionAdd', async (reaction, user) => {
    if (reaction.message.partial) await reaction.message.fetch();
    if (reaction.partial) await reaction.fetch();
    if (user.bot) return;
    if (!reaction.message.guild) return;
});


// Adding reaction-role function
client.on('messageReactionAdd', async (reaction, user) => {
    if (reaction.message.partial) await reaction.message.fetch();
    if (reaction.partial) await reaction.fetch();
    if (user.bot) return;
    if (!reaction.message.guild) return;
    if (reaction.message.channel.id == '816869798436274218') {
        if (reaction.emoji.name === '🦊') {
            await reaction.message.guild.members.cache
                .get(user.id)
                .roles.add('816866994133401652');
        }
        if (reaction.emoji.name === '🐍') {
            await reaction.message.guild.members.cache
                .get(user.id)
                .roles.add('816867114350673961');
        }
    } else return;
});

// Removing reaction roles
client.on('messageReactionRemove', async (reaction, user) => {
    if (reaction.message.partial) await reaction.message.fetch();
    if (reaction.partial) await reaction.fetch();
    if (user.bot) return;
    if (!reaction.message.guild) return;
    if (reaction.message.channel.id == '816869798436274218') {
        if (reaction.emoji.name === '🦊') {
            await reaction.message.guild.members.cache
                .get(user.id)
                .roles.remove('816866994133401652');
        }
        if (reaction.emoji.name === '🐍') {
            await reaction.message.guild.members.cache
                .get(user.id)
                .roles.remove('816867114350673961');
        }
    } else return;
});

