const economy = require('@features/economy')
const profileSchema = require('@schema/profile-schema')
const defaultItem = require('@root/json/rpg.json')
const core = require('@core/core')
const Discord = require('discord.js');

const clockEmojisUrl = [
    'https://cdn.discordapp.com/emojis/828242728919629825.png',
    'https://cdn.discordapp.com/emojis/827083142459424808.png',
    'https://cdn.discordapp.com/emojis/827083142296895490.png',
    'https://cdn.discordapp.com/emojis/827083142488916018.png',
    'https://cdn.discordapp.com/emojis/827083142741229588.png',
    'https://cdn.discordapp.com/emojis/827083142631391232.png',
    'https://cdn.discordapp.com/emojis/827083142744637450.png',
    'https://cdn.discordapp.com/emojis/827083143680491536.png',
    'https://cdn.discordapp.com/emojis/827083143781154816.png',
    'https://cdn.discordapp.com/emojis/827083143256735766.png',
    'https://cdn.discordapp.com/emojis/827083143923892224.png',
    'https://cdn.discordapp.com/emojis/827083143826636880.png',
];

module.exports = {
    commands: ['clockguess', 'cg'],
    expectedArgs: "Rỗng",
    permissionError: 'Bạn phải là adventure để sử dụng lệnh này',
    description: "Dự đoán đồng hồ",
    requiredRoles: ['adventure'],
    cooldown: 5,
    callback: async (message, arguments) => {
        //check if self exists or is in an interaction
        const { guild, member } = message
        const { id } = member
        const guildId = guild.id
        const userId = id
        const userProfile = await profileSchema.findOne({ guildId, userId })
        const status = await core.checkAvailabilityWithToken(message, userProfile)
        if (!status) return;
        
        const idle = 10000;
        const filter = response => response.author.id == userId;

        const description = `Kim đồng hồ sẽ chỉ số mấy (1-12)?`;
        let embed = new Discord.MessageEmbed();
        embed.setAuthor(message.member.nickname ? message.member.nickname : message.author.username, message.author.avatarURL())
            .setColor(message.member.displayHexColor)
            .setDescription(description)
            .setImage(`https://cdn.discordapp.com/emojis/828201960678359072.gif`);

        let breakCheck = false;
        let money = 0;

        const itemDB = {
            name: 'token',
            quantity: -1
        }
        await economy.addItem(guildId, userId, itemDB).catch(err => {
            return message.reply('Hệ thống đang bị lỗi, bạn vui lòng thử lại sau.');
        });
        
        message.channel.send(embed).then(async m => {
            await message.channel.awaitMessages(filter, {max : 1, time : idle, err : ['time']}).then(async collected => {
                const correct = Math.floor(Math.random() * 12) + 1;
                const content = collected.first().content;
                const answer = parseInt(content);

                if (answer < 1 || answer > 12 || !answer) {
                    embed.setDescription('Trả lời lạc đề. Bạn dùng token rõ lãng phí.')
                        .setImage(null);
                } else {
                    let distance = 6 - Math.abs(6 - Math.abs(answer - correct));
                    money = 300 - 50 * distance;
                    embed.setDescription(`Chúc mừng, bạn đã nhận được :yen:\`${money}\`!\n\n**Đáp án:**`)
                        .setImage(clockEmojisUrl[correct % 12])
                        .setThumbnail(clockEmojisUrl[answer % 12]);
                };
                message.channel.send(embed);
            });
            m.delete();
        })
        

        const promises = [
            await profileSchema.findOneAndUpdate({ guildId, userId }, { availability: true }, { upsert: true }),
            await economy.addCoins(guildId, userId, money)
        ];
        Promise.all(promises).catch(err => {
            message.reply('Bị lỗi, Violet chưa biết xử lý làm sao hết!');
            console.log('promise err ', err);
        });

    }
}