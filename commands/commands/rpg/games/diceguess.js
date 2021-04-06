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
];
const reacts = ['↘', '➡', '↗', '🛑'];

function getDice(coef) {
    coef++;
    let sum = 0;
    for (let i = 0; i < coef; i++)
        sum += Math.floor(Math.random() * 9 + 1);
    return Math.floor(sum / (coef));
}

function diceString(array) {
    let d = [];
    for (let i = 0; i < 6; i++) {
        d[i] = i < array.length ? diceEmojis[array[i]] : diceEmojis[0];
    }
    return `${d[0]} : ${d[1]} ${d[2]} ${d[3]} ${d[4]} ${d[5]}`;
}

module.exports = {
    commands: ['diceguess', 'dg'],
    expectedArgs: "Rỗng",
    permissionError: 'Bạn phải là adventure để sử dụng lệnh này',
    description: "Dự đoán xúc xắc",
    requiredRoles: ['adventure'],
    cooldown: 5,
    callback: async (message, arguments) => {
        //check if self exists or is in an interaction
        const { guild, member } = message;
        const { id } = member;
        const guildId = guild.id;
        const userId = id;
        const userProfile = await profileSchema.findOne({ guildId, userId });
        const status = await core.checkAvailabilityWithToken(message, userProfile);
        const tokenPrice = defaultItem.items.find(item => item.name == 'token').price;
        if (!status) return;
        
        const idle = 10000;
        const filter = (r, u) => ((reacts.includes(r.emoji.name)) && u.id == userId);

        let array = [getDice(0)];
        
        const description = `Số tiếp theo (1 - 9)  nhỏ hơn (↘), bằng (➡) hay lớn hơn (↗) số hiện tại?\n`
            + `Bạn có thể dừng lại bằng cách chọn '🛑'.`;
        let embed = new Discord.MessageEmbed();
        embed.setAuthor(message.member.nickname ? message.member.nickname : message.author.username, message.author.avatarURL())
            .setColor(message.member.displayHexColor)
            .setTitle("Dự đoán xúc xắc")
            .setDescription(description)
            .addField("\u200b", diceString(array));

        let breakCheck = false;
        let money = 0;

        const itemDB = {
            name: 'token',
            quantity: -1
        }
        await economy.addItem(guildId, userId, itemDB).catch(err => {
            return message.reply('Hệ thống đang bị lỗi, bạn vui lòng thử lại sau.');
        });
        
        await message.channel.send(embed).then(async (msg) => {
            array.push(getDice(1));
            console.log(array);
            reacts.forEach((r) => msg.react(r));
            await profileSchema.updateMany({ guildId, userId: { $in: [userId] } }, { availability: false });

            let i = 1;
            const rC = msg.createReactionCollector(filter, { max : 5, time : idle });
            rC.on('collect', (r, u) => {
                let answer = r.emoji.name;
                let answerCheck = false;
                r.users.remove(r.users.cache.find(u => u === message.author));
                switch (answer) {
                    case '🛑':
                        return rC.stop('user stop');
                    case '↘':
                        answerCheck = (array[i] < array[i-1]);
                        break;
                    case '➡':
                        answerCheck = (array[i] == array[i-1]);
                        break;
                    case '↗':
                        answerCheck = (array[i] > array[i-1]);
                        break;
                };

                embed.fields.find(e => e.name == '\u200b').value = diceString(array);
                if (answerCheck) {
                    money += (i == 5 ? 100 : 50);
                    if (i == 5) return;
                    embed.setDescription(`**Chính xác!** Tiền thưởng của bạn là :yen:\`${money}\`!\n\n${description}`);
                } else return rC.stop('wrong');
                msg.edit(embed);
                i++;
                array.push(getDice(i));
                console.log(array);
                rC.resetTimer();
            });
            rC.on('end', async (c, r) => {
                console.log(r);
                switch (r) {
                    case 'time':
                        money = Math.floor(money >= tokenPrice ? tokenPrice : money * 0.9);
                        embed.setDescription(`**Hết giờ!** Trò chơi kết thúc, bạn nhận được :yen:\`${money}\`.`);
                        break;
                    case 'wrong':
                        money = Math.floor(money >= tokenPrice ? tokenPrice : money * 0.9);
                        embed.setDescription(`**Sai!** Trò chơi kết thúc, bạn nhận được :yen:\`${money}\`.`);
                        break;
                    case 'user stop':
                        embed.setDescription(`Bạn đã chọn dừng cuộc chơi.\n\nSố tiền bạn nhận được là :yen:\`${money}\`.`);
                        break;
                    case 'limit':
                        embed.setDescription(`**Chính xác!** Trò chơi kết thúc, bạn nhận được :yen:\`${money}\`.`);
                        break;
                }
                msg.edit(embed);
                msg.reactions.removeAll();
                console.log(money);
    
                const promises = [
                    await profileSchema.findOneAndUpdate({ guildId, userId }, { availability: true }, { upsert: true }),
                    await economy.addCoins(guildId, userId, money)
                ];
                Promise.all(promises).catch(err => {
                    message.reply('Bị lỗi, Violet chưa biết xử lý làm sao hết!');
                    console.log('promise err ', err);
                });
            });
        });

    }
}