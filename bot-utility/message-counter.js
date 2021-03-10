const mongo = require('../mongo')
const messageCountSchema = require('../schema/message-count-schema')

module.exports = (client) => {

    client.on('message', async (message) => {

        if (message.channel.id == '816865305807814676') {

            const { author } = message
            const { id } = author

            await mongo().then(async (mongoose) => {
                try {
                    await messageCountSchema.findOneAndUpdate(
                        {
                            _id: id
                        },
                        {
                            $inc: {
                                'messageCount': 1
                            }
                        },
                        {
                            upsert: true
                        })
                        .exec()
                } finally {
                    mongoose.connection.close()
                }
            })

        }//channel id test


    })
}