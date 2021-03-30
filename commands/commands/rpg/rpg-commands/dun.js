const economy = require('@features/economy')
const hp = require('@features/hp')
const defaultItem = require('@root/json/rpg.json')
const story1p = require('@root/json/1p/rpg-1p.json')
const Discord = require('discord.js');
const core = require('@core/core')
const profileSchema = require('@schema/profile-schema')

module.exports = {
    commands: ['dun'],
    expectedArgs: "Rỗng",
    permissionError: 'Bạn phải là adventure để sử dụng lệnh này',
    description: "Thám hiểm dungeon",
    requiredRoles: ['adventure'],
    cooldown: 5,
    callback: async (message) => {

        const story = core.randomGen(story1p.story)
        const guildId = message.guild.id
        const userId = message.author.id
        const userProfile = await profileSchema.findOne({ guildId, userId })

        //check if self exists or is in an interaction
        const status = await core.checkAvailabilityWithToken(message, userProfile)
        if (!status) return

        console.log(core.calWeight(1, 3))

    }
}