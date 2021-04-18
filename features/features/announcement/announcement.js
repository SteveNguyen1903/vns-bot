const Discord = require('discord.js')

// module.exports = async (client) => {}

module.exports = async (client) => {
	const channel = await client.channels.cache.get('824984675972939826')
	if (!channel) {
		return
	}

	// general
	const embed1 = new Discord.MessageEmbed()
		.setTitle('Leidenschaftlich')
		.setDescription('Chào mừng các bạn đến với thành phố Leidenschaftlich. Đây là một thế giới nơi công nghệ và phép màu dung hòa. Để tham gia thì bạn phải là regular của server và lấy role "adventure" ở channel phía dưới (sẽ mở khi bạn đạt cấp độ regular).\nHiện game đang trong quá trình phát triển và sẽ hoàn thiện hơn trong những ngày tiếp theo.\n\nPrefix của Violet bot sẽ là "!!"')
		.setThumbnail('https://i.imgur.com/sEcD1lZ.jpg')
		.setImage('https://i.imgur.com/bs3ESNo.jpg')
		// .addFields(
		//     { name: 'Lệnh hiện có:', value: `"daily" : Nhiệm vụ ngày, phần thưởng coins ngẫu nhiên, 150 exp. Hồi trong 12h.\n"buy" : cú pháp <tên món hàng> <số lượng>. Món hàng hiện có bao gồm "token".\n"info" : Kiểm tra kho đồ.\n"react" : tương tác với người chơi khác.` },
		// )
		.setFooter(`v4v`, 'https://i.imgur.com/pmDv6Hb.png')
		.setTimestamp()
		.setColor(`#FFFDC0`)

	// Dungeon
	const embed2 = new Discord.MessageEmbed()
		.setTitle('Elfazz')
		.setDescription(
			'Elfazz - Ngôi mộ của những vị vua cổ xưa. Tọa lạc tại Tây Bắc thành phố Leidenschaftlich. Khi đến gần, ai cũng cảm thấy bầu không khí còn vương vấn đôi chút ma phép nhiệm màu. Những họa tiết điêu khắc tỉ mỉ trên từng cánh cửa phác họa nên thời huy hoàng một trong những nền văn minh sớm nhất nhân loại. Tiếc là giờ đây tất cả chi là đống tro tàn. Nơi đây chứa đầy cạm bẫy, các adventure phải hết sức cẩn thận.',
		)
		.setThumbnail('https://i.imgur.com/0piFMAq.png')
		// .setImage('https://i.imgur.com/7UZ7vwz.jpg')
		.addFields({ name: 'Type:', value: `dungeon, fantasy` })
		.setFooter(`v4v`, 'https://i.imgur.com/pmDv6Hb.png')
		.setTimestamp()
		.setColor(`#FFFDC0`)

	// Partner
	const embed3 = new Discord.MessageEmbed()
		.setTitle('Giới thiệu hệ thống Waif...partner')
		.setDescription('Partner là người đồng hành với các adventure. Tóm lại để các adventure self-insert cho thỏa thích')
		.setThumbnail('https://i.imgur.com/XNIvcuV.png')
		// .setImage('https://i.imgur.com/7UZ7vwz.jpg')
		.addFields({ name: 'Hướng dẫn:', value: `Hãy vào <#826790735491235870> để đọc` })
		.setFooter(`v4v`, 'https://i.imgur.com/pmDv6Hb.png')
		.setTimestamp()
		.setColor(`#FFFDC0`)

	const embedArr = [embed1, embed2, embed3]

	//send message first then edit.
	// channel.send(embed3)

	channel.messages.fetch().then(async (messages) => {
		const msgIdArr = []
		for (const message of messages) {
			msgIdArr.push(message[0])
		}

		msgIdArr.reverse().forEach(async (item, index) => {
			channel.messages
				.fetch(item)
				.then((message) => message.edit(embedArr[index]))
				.catch(console.error)
		})
	})
}
