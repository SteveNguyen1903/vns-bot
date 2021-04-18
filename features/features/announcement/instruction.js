let menuImport = require('@util/rpg/announcement-template/template')

// module.exports = async (client) => {}

module.exports = async (client) => {
	const channel = await client.channels.cache.get('826790735491235870')
	if (!channel) {
		return
	}

	let menu = menuImport.getList()

	//send message first then edit.
	// channel.send(menu[3])

	channel.messages.fetch().then(async (messages) => {
		const msgIdArr = []
		for (const message of messages) {
			msgIdArr.push(message[0])
		}

		msgIdArr.reverse().forEach(async (item, index) => {
			channel.messages
				.fetch(item)
				.then((message) => message.edit(menu[index]))
				.catch(console.error)
		})
	})
}
