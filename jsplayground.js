var fs = require('fs')
const path = require('path')
const partnerSchema = require('@schema/partner-schema')

const arr1 = [
	{ name: 'des1', type: 'test1' },
	{ name: 'des2', type: 'test1' },
	{ name: 'des3', type: 'test1' },
	{ name: 'des4', type: 'test1' },
	{ name: 'des5', type: 'test1' },
]

const arr2 = [{ name: 'des1' }, { name: 'des2' }]

const test = arr2.map((character) => {
	const testres = arr1.filter((item) => item.name === character.name)
	return testres
})

console.log(test)

const arr3 = [
	[
		{
			name: ['Ryoka Narusawa', 'Ryoka'],
			anime: 'Occultic;Nine',
			stars: 3,
			description: 'Master cẩn thận, Ryo-tas có súng điện đó. Lâu lâu tự dưng thấy Ryoka ôm master thì ngay sau đó kiểu gì master cũng bị giật lòi mắt. Xong rồi thì Ryo-tas sẽ tạo dáng ta-da~!, rồi thong thả ra chỗ khác chơi mà quên mất master.',
			img: ['https://i.imgur.com/cvtF14I.png', 'https://i.imgur.com/IA700SE.jpg', 'https://i.imgur.com/YJMQwiG.png', 'https://i.imgur.com/23PaNnY.jpg'],
			type: 'kuudere',
		},
	],
	[
		{
			name: ['Claris'],
			anime: 'Meteor World Actor (VN)',
			stars: 3,
			description: 'Elf nổi tiếng dễ thương và tốt bụng, và Claris cũng sẽ đối xử với master như vậy cho tới khi master hết tiền. Tiền bạc đối với cô không phải là thứ có thể qua loa cho xong chuyện, nên dù có gắn bó với master bao nhiêu nhưng không sòng phẳng trong chuyện tài chính thì thôi đừng hòng nhìn mặt nhau',
			img: ['https://i.imgur.com/TXtV4If.png', 'https://i.imgur.com/Q8Vcno0.png', 'https://i.imgur.com/WIJKEsI.png', 'https://i.imgur.com/8eyvTZF.png'],
			type: 'kuudere',
		},
	],
	[{ name: ['Fubuki Shirakami', 'Fubuki'], anime: 'XX', stars: 3, description: 'XX', img: ['https://i.imgur.com/ftdS5hO.png'], type: 'kuudere' }],
	[{ name: ['Pico', 'Pi'], anime: 'Boku no Pico', stars: 3, description: 'Gae', img: ['https://i.imgur.com/pnbiCmf.jpg'] }],
	[{ name: ['Rin Toosaka', 'Rin'], anime: 'XX', stars: 4, description: 'XX', img: ['https://i.imgur.com/ftdS5hO.png'], type: 'kuudere' }],
	[{ name: ['Rushia Uruha', 'Rushia'], anime: 'XX', stars: 3, description: 'XX', img: ['https://i.imgur.com/ftdS5hO.png'], type: 'kuudere' }],
	[
		{
			name: ['Ishtar'],
			anime: 'XX',
			stars: 4,
			description: 'Nữ thần sắc đẹp, chiến tranh, và mùa vụ của nền văn minh Lưỡng Hà. Trong mắt cô, master chỉ là thứ để nghịch cho đỡ chán, nhưng dần dà con người ấy lại khiến cô tự nhủ với mình rằng cô phải bảo vệ họ. Trong ấm ngoài lạnh, chuẩn mực của tsundere',
			img: ['https://i.imgur.com/7HMEunY.jpg', 'https://i.imgur.com/kqc2KjZ.jpg', 'https://i.imgur.com/vshuTyD.png', 'https://i.imgur.com/q53MCz7.png'],
			type: 'tsundere',
		},
	],
	[{ name: ['Okayu Nekomata', 'Okayu'], anime: 'XX', stars: 3, description: 'XX', img: ['https://i.imgur.com/ftdS5hO.png'], type: 'kuudere' }],
	[{ name: ['Onoe Serika', 'Onoe'], anime: 'Chaos;Child', stars: 3, description: 'Một cô gái năng động nhưng ngu ngơ. Master đi đâu làm trò gì cô cũng vòi đi theo, nhưng tới lúc đến thì master phải làm hết.', img: ['https://i.imgur.com/bYD5se8.png', 'https://i.imgur.com/5aAzhG5.jpg', 'https://i.imgur.com/8lvUMYY.png', 'https://i.imgur.com/5riSNbW.jpg'], type: 'kuudere' }],
	[
		{
			name: ['Zero Two', '02'],
			anime: 'Darling in the Franxx',
			stars: 5,
			description: 'Zero Two là một cô gái nhân tạo với tha thiết làm người. Tuy bề ngoài lạnh nhạt nhưng cô lại rất chung tình và dịu dàng với người cô đã chọn làm partner.',
			img: ['https://i.imgur.com/hbxfhBJ.png', 'https://i.imgur.com/kBGiTw4.png', 'https://i.imgur.com/bS4Hw0w.png', 'https://i.imgur.com/suIEVzo.png'],
			type: 'tsundere',
		},
	],
	[{ name: ['Ayame Nakiri', 'Ayame'], anime: 'XX', stars: 3, description: 'XX', img: ['https://i.imgur.com/ftdS5hO.png'], type: 'kuudere' }],
	[],
	[{ name: ['Eru Chitanda', 'Eru'], anime: 'Hyouka', stars: 5, description: 'Tò mò và năng động, Eru sẽ mang đến nhiều điều thú vị lẫn phiền phức nếu bạn vào tầm ngắm của nàng.', img: ['https://i.imgur.com/nCRNpXp.png', 'https://i.imgur.com/RExYxOY.png', 'https://i.imgur.com/FJ9ciKm.png', 'https://i.imgur.com/y1wZQWk.png', 'https://i.imgur.com/ovFImbV.png'], type: 'kuudere' }],
	[{ name: ['Kaguya Shinomiya', 'Kaguya'], anime: 'XX ', stars: 4, description: 'XX', img: ['https://i.imgur.com/ftdS5hO.png'], type: 'kuudere' }],
	[
		{
			name: ['Violet Evergarden', 'Violet'],
			anime: 'Violet Evergarden',
			stars: 5,
			description: 'Dù bạn ở bất cứ nơi nào, Violet sẽ giúp bạn gửi nỗi lòng đến người bạn yêu thương. Một partner đồng hành hết sức tuyệt vời! Thế nhưng, Violet vẫn đang thiết tha tìm kiếm điều gì đó. Liệu bạn có thể giúp nàng tìm ra?',
			img: ['https://i.imgur.com/bXEPfZc.png', 'https://i.imgur.com/LhXNwDW.png', 'https://i.imgur.com/5BU9ldC.png', 'https://i.imgur.com/UusOINX.png'],
			type: 'kuudere',
		},
	],
	[{ name: ['Marine Houshou', 'Marine'], anime: 'XX', stars: 3, description: 'XX', img: ['https://i.imgur.com/ftdS5hO.png'], type: 'kuudere' }],
	[
		{
			name: ['Nishimiya Shouko', 'Shouko'],
			anime: 'Koe no Katachi ',
			stars: 4,
			description: 'Nhút nhát và bị câm từ nhỏ, nhưng cô nàng rất dễ thương và dịu dàng nếu bạn để ý. Một trái tim giàu tình cảm nếu bạn vượt qua được rào cản giao tiếp.',
			img: ['https://i.imgur.com/vWALKye.png', 'https://i.imgur.com/Eqi0KQZ.png', 'https://i.imgur.com/50zXpiq.png', 'https://i.imgur.com/asBj7yI.png'],
			type: 'kuudere',
		},
	],
	[{ name: ['Asuka Langley Souryuu', 'Asuka'], anime: 'XX', stars: 4, description: 'XX', img: ['https://i.imgur.com/ftdS5hO.png'], type: 'tsundere' }],
	[
		{
			name: ['Ai Hayasaka', 'Hayasaka'],
			anime: 'Kaguya-sama Love is war ',
			stars: 4,
			description:
				' Trong mắt bạn bè và thầy cô, Ai Hayasaka là một con bé cực kì dễ thương, ngây ngô và hoạt bát. Nhưng khi không có ai xung quanh, cô lại trở thành một con người lạnh lùng, ít nói với đôi mắt sắc bén đến mức những gã đàn ông lớn hơn cô vài con giáp cũng phải né cô ra. Những người từng vô tình thấy cả hai tính cách của Hayasaka, một số thì sợ, số khác lại khinh cô ra mặt vì nghĩ cô là hạng giả tạo. Nhưng họ không biết, chỉ có partner và những ai cô yêu quý nhất mới biết được con người thật của cô...',
			img: ['https://i.imgur.com/iXrT7Hi.jpg', 'https://i.imgur.com/mLZ7s9F.jpg', 'https://i.imgur.com/pxeUa9p.jpg', 'https://i.imgur.com/Ntxl8oS.png'],
			type: 'tsundere',
		},
	],
	[{ name: ['Kokoa Hoto', 'Kokoa'], anime: 'XX', stars: 4, description: 'XX', img: ['https://i.imgur.com/ftdS5hO.png'], type: 'kuudere' }],
	[
		{
			name: ['Nao Tomori', 'Nao'],
			anime: 'Charlotte',
			stars: 4,
			description: 'Cứng đầu và đôi lúc kiêu căng, Nao luôn khiến người khác nổi điên một phần vì thái độ của cô, phần khác vì cái thái độ đấy lại đi cùng với thực lực chứ không chỉ nói suông. Cách hay nhất để dỗ con thú trong Tomori là dắt cô đi ăn hàng - bắp nướng với BBQ là hiệu quả nhất!',
			img: ['https://i.imgur.com/Vgvq2XS.png', 'https://i.imgur.com/LiFGMKM.png', 'https://i.imgur.com/rfNZsFD.png', 'https://i.imgur.com/SA8SJ7j.png'],
			type: 'kuudere',
		},
	],
	[{ name: ['Ichigo'], anime: 'Darling in the Franxx', stars: 4, description: 'XX', img: ['https://i.imgur.com/ftdS5hO.png'], type: 'tsundere' }],
	[
		{
			name: ['Kanade Tachibana', 'Kanade'],
			anime: 'Angel Beats!',
			stars: 5,
			description: 'Gương mặt cô không bao giờ thể hiện cảm xúc nhưng chỉ cần partner trao cho cô trái tim của mình, cô sẽ giúp partner với tất cả những gì cô có bằng cả tấm lòng của mình.',
			img: ['https://i.imgur.com/MUnpdL7.png', 'https://i.imgur.com/NY02uPe.png', 'https://i.imgur.com/JUIUglR.png', 'https://i.imgur.com/0uD6Z2R.png'],
			type: 'kuudere',
		},
	],
	[
		{
			name: ['Mashu Kyrielight', 'Mash'],
			anime: 'Fate/GO',
			stars: 5,
			description: 'Bản chất cô là một con người ấm áp, đầy lòng trắc ẩn và vì bị giam lỏng ở nơi thí nghiệm nên cô rất thích thú với việc khám phá thế giới bên ngoài. Đối với partner của mình, cô sẽ là một kouhai tuyệt vời, luôn sát cách và ủng hộ partner cùng vượt qua khó khăn, sẵn sàng che chở và thậm chí hy sinh bản thân vì partner.',
			img: ['https://i.imgur.com/pA27cS9.png', 'https://i.imgur.com/BgpdXwm.png', 'https://i.imgur.com/tu29Q7s.png', 'https://i.imgur.com/PJZu1y8.png'],
			type: 'kuudere',
		},
	],
	[
		{
			name: ['Chloe von Einzbern', 'Chloe'],
			anime: 'Fate/Kaleid liner',
			stars: 4,
			description: ' Trái nghịch với đứa em sinh đôi nhút nhát, Chloe luôn đối xử phóng khoáng với tất cả mọi người, từ tính tình cho tới cách ăn mặc. Vì thế nên đi chơi với partner, lời ăn tiếng nói của cô đối lúc có vẻ như vô tâm, nhưng cái vô tâm ấy chỉ là sự vô tư của một đứa trẻ, dù cho Chloe có cố ra vẻ rằng mình trướng thành hơn Illya.',
			img: ['https://i.imgur.com/d4qBUVv.jpg', 'https://i.imgur.com/9VLu1yt.png', 'https://i.imgur.com/ZfTO16f.jpg', 'https://i.imgur.com/fJVpOPN.png'],
			type: 'kuudere',
		},
	],
]

let filterArr = arr3
	.filter((item) => {
		if (item.length > 0) return item
	})
	.filter((item) => {
		console.log(item)

		let res = item[0].name[0]
		return res

		// item[0].stars === 3
	})

console.log(filterArr)
