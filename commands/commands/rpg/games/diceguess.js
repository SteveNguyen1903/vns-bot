const economy = require('@features/economy')
const profileSchema = require('@schema/profile-schema')
const defaultItem = require('@root/json/rpg.json')
const core = require('@core/core')
const Discord = require('discord.js');

const diceEmojis = [
    '<:d0:827209440310722621>',
    '<:d1:827209440796213300>',
    '<:d2:827209441190608976>',
    '<:d3:827209441812021248>',
    '<:d4:827209441203322940>',
    '<:d5:827209441149321316>',
    '<:d6:827209442079801354>',
    '<:d7:827209442079932446>',
    '<:d8:827209441233207306>',
    '<:d9:827209441425752094>',
]

module.exports = {
    commands: ['diceguess', 'dg'],
    expectedArgs: "Rỗng",
    permissionError: 'Bạn phải là adventure để sử dụng lệnh này',
    description: "Dự đoán xúc xắc",
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
        
        const idle = 120000;
        const filter = m => m.author == message.author && (m.content == '<' || m.content == '=' || m.content == '>' || m.content == 'quit');

        var array = [];
        for (let i = 0; i < 6; i++)
            array.push(Math.floor(Math.random() * 10));
        console.log(array);

        var diceString = `${diceEmojis[array[0]]}`;
        const description = `Số tiếp theo (0 - 9)  nhỏ hơn (\`<\`), lớn hơn (\`>\`) hay bằng (\`=\`) số hiện tại?\nBạn có thể dừng lại bằng cách gõ \`quit\``;
        var embed = new Discord.MessageEmbed();
        embed.setAuthor(message.member.nickname ? message.member.nickname : message.author.username, message.author.avatarURL())
            .setColor(message.member.displayHexColor)
            .setTitle("Dự đoán xúc xắc")
            .setDescription(description)
            .addField("\u200b", diceString);

        var breakCheck = false;
        var money = 0;

        const itemDB = {
            name: 'token',
            quantity: -1
        }
        await economy.addItem(guildId, userId, itemDB).catch(err => {
            return message.reply('Hệ thống đang bị lỗi, bạn vui lòng thử lại sau.');
        })
        for (i = 1; i < 6; i++) {
            await message.channel.send(embed).then(async () => {
                await profileSchema.updateMany({ guildId, userId: { $in: [userId] } }, { availability: false });

                await message.channel.awaitMessages(filter, {idle : idle, dispose : true, max : 1, error : ['time']}).then(collected => {
                    const content = collected.first().content;
                    if (content == 'quit') {
                        embed.setDescription(`Bạn đã chọn dừng cuộc chơi.\n\nSố tiền bạn nhận được là :yen:\`${money}\`.`);
                        breakCheck = true;
                        return message.channel.send(embed);
                    };
                    
                    if ((array[i] < array[i-1] && content == '<') || (array[i] == array[i-1] && content == '=') || (array[i] > array[i-1] && content == '>')) {
                        money += (i == 5 ? 100 : 50);
                        diceString = `${diceString}${diceEmojis[array[i]]}`;
                        embed.setDescription(
                            `**Chính xác!** ${i == 5 ? 'Trò chơi kết thúc, bạn nhận được' : 'Tiền thưởng của bạn là'} :yen:\`${money}\`!${i != 5 ? '\n\n' + description : ''}`);
                        embed.fields.find(e => e.name == '\u200b').value = diceString;
                        if (i == 5)
                            message.channel.send(embed);
                    } else {
                        money = Math.floor(money / 2);
                        diceString += diceEmojis[array[i]];
                        embed.setDescription(`**Sai!** Trò chơi kết thúc, bạn nhận được :yen:\`${money}\`.`);
                        breakCheck = true;
                        return message.channel.send(embed);
                    };
                }).catch(err => {
                    money = Math.floor(money / 2);
                    embed.setDescription(`**Hết giờ!** Trò chơi kết thúc, bạn nhận được :yen:\`${money}\`.`);
                    breakCheck = true;
                    return message.channel.send(embed);
                });
            });
            
            if (breakCheck)
                break;
        };

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