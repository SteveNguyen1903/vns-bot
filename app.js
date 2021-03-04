const Discord = require('discord.js');
require('dotenv').config();

const client = new Discord.Client();

client.login(process.env.BOT_TOKEN);

client.on('ready', () => console.log('The Bot is ready!'));

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

