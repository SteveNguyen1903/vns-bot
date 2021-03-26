
const sagiri = require("sagiri");
const Discord = require('discord.js');
const sagiriBot = sagiri(process.env.SAUCE_API);
const fetch = require("node-fetch");

module.exports = {
    commands: 'anime',
    minArgs: 0,
    maxArgs: null,
    description: 'Anime search',
    callback: async (message, arguments, text) => {
        if (message.attachments.size > 0) {
            let image = message.attachments.first().url;

            //using sagiri
            // const results = await sagiriBot(image, { mask: [20] });
            // let anime = results[0]
            // const embed = new Discord.MessageEmbed()
            //     .setTitle('Anime (Click để chuyển trang)')
            //     .setURL(anime.url)
            //     .setImage(anime.thumbnail)
            //     .addFields({
            //         name: `Anime: ${anime.raw.data.source}`,
            //         value: `Year: ${anime.raw.data.year}`
            //     })
            //     .setFooter(`Similarity: ${anime.similarity}`)
            //     .setColor(`#00AAF`)
            // message.channel.send(embed)

            //using tracemoe
            let url = `https://trace.moe/api/search?url=`;
            let querryUrl = url + image;

            let response = await fetch(querryUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            })

            let results = await response.json();

            if (results.docs.length > 0) {
                const anime = results.docs[0]
                const similarity = ((results.docs[0].similarity) * 100).toFixed(2)
                if (similarity > 50) {
                    const embed = new Discord.MessageEmbed()
                        .setTitle('Violet tìm được')
                        .setDescription('Bạn vui lòng up ảnh không crop để Violet tìm ảnh dễ dàng hơn nha')
                        .setImage(image)
                        .addFields(
                            { name: 'Anime:', value: `${anime.anime}`, inline: true },
                            { name: `Tập:`, value: `${anime.episode}`, inline: true },
                            { name: `Anilist`, value: `https://anilist.co/anime/${anime.anilist_id}`, inline: true })
                        .setFooter(`Mức độ chính xác: ${similarity}%`)
                        .setColor(`#00AAF`)
                    message.channel.send(embed)
                }
                else {
                    message.channel.send(`Kết quả trả về có mức độ chính xác quá thấp để hiển thị, bạn thông cảm cho Violet nha!`)
                }
            } else {
                message.channel.send(`Có lỗi trong quá trình tìm kiếm`)
            }

        } else {
            message.channel.send(`Bạn hãy upload ảnh bằng Discord để sử dụng tính năng này`)
        }
    }
}