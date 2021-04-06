const profileSchema = require('@schema/profile-schema');

module.exports = {
    commands: ['setavailability', 'setavail'],
    minArgs: 2,
    expectedArgs: "<Target user's @> (<True/False>)",
    requiredChannel: 'bot-test',
    callback: async (message, arguments) => {
        const { guild } = message;
        const guildId = guild.id;
        const targetUser = message.mentions.users.first();
        if (!targetUser) {
            message.reply('Please specify someone to give a role to.');
            return;
        }
        const userId = targetUser.id;

        const rawValue = arguments[1].toLowerCase();
        const value = rawValue == 'true' ? true : false;
        const promise = await profileSchema.findOneAndUpdate({ guildId, userId }, { availability: value }, { upsert: true });
        Promise.resolve(promise).then(() =>{
            message.reply(`đã đặt lại trạng thái sẵn sàng của <@${userId}> thành \`${value}\`.`);
        }).catch(err => {
            message.reply('Bị lỗi, Violet chưa biết xử lý làm sao hết!');
            console.log('promise err ', err);
        });
    }
}