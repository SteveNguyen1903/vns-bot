const command = require('../command')
const sagiri = require("sagiri");
const Discord = require('discord.js');
const sagiriBot = sagiri(process.env.SAUCE_API);


module.exports = (client) => {

    command(client, 'anime', async (message) => {

        if (message.attachments.size > 0) {
            let image = message.attachments.first().url;

            const results = await sagiriBot(image, { mask: [20] });

            let anime = results[0]

            const embed = new Discord.MessageEmbed()
                .setTitle('Anime (Click để chuyển trang)')
                .setURL(anime.url)
                .setImage(anime.thumbnail)
                .addFields({
                    name: `Anime: ${anime.raw.data.source}`,
                    value: `Year: ${anime.raw.data.year}`
                })
                .setFooter(`Similarity: ${anime.similarity}`)
                .setColor(`#00AAF`)

            message.channel.send(embed)
        } else {
            message.channel.send(`Bạn hãy upload ảnh bằng Discord để sử dụng tính năng này`)
        }

    })


}