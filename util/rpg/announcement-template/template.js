const Discord = require('discord.js')

module.exports.getList = () => {

    const embed1 = new Discord.MessageEmbed()
        .setTitle('Shop')
        .setDescription('Hệ thống shop của Leidenschaftlich. Bot sẽ có prefix là "!!"')
        .setThumbnail('https://i.imgur.com/WWGnnsg.png')
        .setImage('')
        .addFields(
            { name: 'Lệnh hiện có:', value: `buy <tên món hàng> <số lượng>\nuse <tên món hàng> **lưu ý**: hiện tại chỉ dùng được potion` },
            { name: 'Items', value: `:coin: "token" ($150) : dùng để thực thi một hành động bất kì.\n:test_tube: "potion" ($100) : hồi 40hp một lần sử dụng.\n:envelope: "letter" ($200) : tính năng chưa cập nhật.` },
        )
        .setTimestamp()
        .setColor(`#FFFDC0`)

    // Dungeon
    const embed2 = new Discord.MessageEmbed()
        .setTitle('Dungeon')
        .setDescription('Leidenschaftlich là một thế giới pha trộn giữa công nghệ và phép thuật, nhưng không ai biết Leidenschaftlich ra đời từ khi nào. Xung quanh thành phố đầy ánh hào quang là một thế giới xa xưa nay chỉ còn là đống tro tàn.\n\nChức năng thám hiểm dungeon dành cho adventure. Yêu cầu 1 token để bắt đầu, bạn sẽ phải đưa ra quyết định ảnh hưởng đến kết quả và phần thưởng.')
        .setThumbnail('https://i.imgur.com/7UZ7vwz.jpg')
        // .setImage('https://i.imgur.com/7UZ7vwz.jpg')
        .addFields(
            { name: 'Lệnh hiện có:', value: `dun` },
            { name: 'Cơ chế', value: `Tình huống ngẫu nhiên được đưa ra, bạn chọn câu trả lời. Mỗi một câu trả lời sẽ có hai tình huống "thắng" và "thua", level cao sẽ tăng khả năng thắng của bạn. Một tình huống sẽ mang lại nhiều chiến lợi phẩm.` },
        )
        .setTimestamp()
        .setColor(`#FFFDC0`)

    const embed3 = new Discord.MessageEmbed()
        .setTitle('Các lệnh cơ bản khác')
        .setDescription('Bot sẽ có prefix là "!!"')
        .setThumbnail('https://i.imgur.com/JDWQ8Mp.jpg')
        .setImage('')
        .addFields(
            { name: 'Lệnh hiện có:', value: `"daily" : Nhận :cross: exp và :yen: tiền mỗi ngày.\n"info" : xem profile của adventure.\n"help" : hiện bảng hướng dẫn` },
            { name: 'Cơ chế khác:', value: `+12h hồi 40 máu.\n+Mỗi lần hồi sức sẽ được hồi 5 máu.\n+Khi máu xuống 0, tự động phải hồi sức` }
        )
        .setTimestamp()
        .setColor(`#FFFDC0`)

    return [embed1, embed2, embed3]

}