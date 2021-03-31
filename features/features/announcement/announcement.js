const Discord = require('discord.js');


module.exports = async (client) => {

    const channel = await client.channels.cache.get('824984675972939826')
    if (!channel) {
        return
    }

    // client.channels.cache.get(`channelID`)
    const embed = new Discord.MessageEmbed()
        .setTitle('Leidenschaftlich')
        .setDescription('Chào mừng các bạn đến với thành phố Leidenschaftlich. Đây là một thế giới nơi công nghệ và phép màu dung hòa. Để tham gia thì bạn phải là regular của server và lấy role "adventure" ở channel phía dưới (sẽ mở khi bạn đạt cấp độ regular).\nHiện game đang trong quá trình phát triển và sẽ hoàn thiện hơn trong những ngày tiếp theo.\n\nPrefix của Violet bot sẽ là "!p"')
        .setThumbnail('https://i.imgur.com/sEcD1lZ.jpg')
        .setImage('https://i.imgur.com/bs3ESNo.jpg')
        // .addFields(
        //     { name: 'Lệnh hiện có:', value: `"daily" : Nhiệm vụ ngày, phần thưởng coins ngẫu nhiên, 150 exp. Hồi trong 12h.\n"buy" : cú pháp <tên món hàng> <số lượng>. Món hàng hiện có bao gồm "token".\n"info" : Kiểm tra kho đồ.\n"react" : tương tác với người chơi khác.` },
        // )
        .setFooter(`v4v`, 'https://i.imgur.com/pmDv6Hb.png')
        .setTimestamp()
        .setColor(`#00AAF`)

    channel.messages.fetch().then((messages) => {
        if (messages.size === 0) {
            // Send a new message
            channel.send(embed)
        } else {
            for (const message of messages) {
                message[1].edit(embed)
            }
        }
    })

}