require('module-alias/register')
require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();
const mongo = require('@db/mongo')

//bot core
const loadCommands = require('@root/commands/load-commands')
const loadFeatures = require('@root/features/load-features')

//extra
// const announcement = require('@util/announcement/announcement')

const EventEmitter = require('events')
EventEmitter.defaultMaxListeners = 50;

client.on('ready', async () => {
    console.log('bot ready')
    // announcement(client, '824984675972939826')

    await mongo()
    loadCommands(client)
    loadFeatures(client)
});

// eslint-disable-next-line no-undef
client.login(process.env.BOT_TOKEN);
