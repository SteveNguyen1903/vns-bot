const Discord = require('discord.js');
const images = [
    'https://media.giphy.com/media/xUO4t2gkWBxDi/giphy.gif',
    'https://media.giphy.com/media/Gf3AUz3eBNbTW/giphy.gif',
    'https://media.giphy.com/media/RrLbvyvatbi36/giphy.gif',
    'https://media.giphy.com/media/Zau0yrl17uzdK/giphy.gif',
    'https://media.giphy.com/media/9U5J7JpaYBr68/giphy.gif',
    'https://media.giphy.com/media/OQ7phVSLg3xio/giphy.gif',
    'https://media.giphy.com/media/qNtqBSTTwXyuI/giphy.gif',
    'https://i.imgur.com/oOCq3Bt.gif',
    'https://i.imgur.com/fm49srQ.gif',
    'https://i.imgur.com/4MQkDKm.gif',
    'https://i.imgur.com/o2SJYUS.gif',
    'https://i.imgur.com/Agwwaj6.gif',
    'https://i.imgur.com/YA7g7h7.gif',
    'https://i.imgur.com/oRsaSyU.gif',
    'https://i.imgur.com/kSLODXO.gif',
    'https://i.imgur.com/CwbYjBX.gif',
    'https://i.imgur.com/VW0cOyL.gif',
    'https://i.imgur.com/mdZR2D2.gif',
    'https://i.imgur.com/ABE1arT.gif',
    'https://i.imgur.com/Li9mx3A.gif',
    'https://i.imgur.com/kVI9SHf.gif',
    'https://i.imgur.com/sKDLYXE.gif',
    'https://i.imgur.com/FQKJpzU.gif',
    'https://i.imgur.com/miFmhBg.gif',
    'https://i.imgur.com/ISDUslk.gif',
    'https://i.imgur.com/Q6iX9OA.gif',
    'https://i.imgur.com/0B7O5Zi.gif',
    'https://i.imgur.com/HcTCdJ1.gif',
    'https://i.imgur.com/HqHljrw.gif',
    'https://i.imgur.com/yAlP0u1.gif',
    'https://i.imgur.com/ESD4TJ2.gif',
    'https://i.imgur.com/CFyc3wX.gif',
    'https://i.imgur.com/ZDiDDdc.gif'
];
const selfslap = [
    'https://media.giphy.com/media/j1zuL4htGTFQY/giphy.gif',
    'https://media.giphy.com/media/EQ85WxyAAwEaQ/giphy.gif'
];
//const cry = 'https://media.giphy.com/media/OwFMSDDOOxmbvwVbvn/giphy.gif';
const kill = 'https://i.imgur.com/ZRVSAOT.gif'
const dance = 'https://i.imgur.com/881etLt.gif'

function getName(member) {
    return member.nickname ? member.nickname : member.user.username;
}

module.exports = {
    commands: 'slap',
    cooldown: 10,
    callback: (message, arguments, text) => {
        const user = message.member;
        const target = message.mentions.members.first();

        let branch = 0; // normal case
        if (!target)
            branch = 1; //slapping air
        else if (target.id == user.id)
            branch = 2; //self slapping
        else if (target.id == message.client.user.id)
            branch = 3; //slap the bot
        if (target.id == '361133453217103875' || target.id == '508281938017255425')
            branch = 4;

        const embed = new Discord.MessageEmbed();
        embed.setColor(message.member.displayHexColor);
        embed.setImage(
            branch == 2
                ? selfslap[Math.floor(Math.random() * selfslap.length)]
                : branch == 3
                    ? kill
                    : branch == 4
                        ? dance
                        : images[Math.floor(Math.random() * images.length)]
        );
        embed.setTitle(`${branch == 1 ? getName(message.guild.me) : getName(user)} tát ${branch == 4 ? 'hụt' : ''}${branch == 1 ? getName(user) : getName(target)}!`);
        let messageText = '';
        switch (branch) {
            case 0:
                messageText = `<@${target.id}>`;
                break;
            case 1:
                messageText = `<@${user.id}>, vì bạn không nói là tát ai, nên chắc là bạn muốn tôi tát bạn.`;
                break;
            case 2:
                messageText = `<@${user.id}>`;
                break;
            case 3:
                messageText = `Dám tát bà này, giết <@${user.id}>!!!!`;
                break;
            case 4:
                messageText = `Violet không tát được ${target.id == '508281938017255425' ? '<@361133453217103875>' : 'con ếch'}!!!!!!!!!!!!!!!!`;
                //le Ếch: có phải Violet tát đâu, cái title của embed ghi là user.id tát target.id mà 🤡
                break;
        }
        message.channel.send(messageText, embed);
    }
}