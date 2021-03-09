const command = require('../command')
const sagiri = require("sagiri");
const Discord = require('discord.js');
const fetch = require("node-fetch");


module.exports = (client) => {
    command(client, 'manga', async (message) => {

        const fetchData = (image) => {
            fetch(`https://saucenao.com/search.php?api_key=${process.env.SAUCE_API}&numres=10&db=37&output_type=2&url=${image}`)
                .then(response => response.json())
                .then((data) => {
                    if (!data.results) message.channel.send(`Không có kết quả tìm kiếm`)
                    let manga = data.results[0]
                    const embed = new Discord.MessageEmbed()
                        .setTitle('Manga (Click để chuyển trang)')
                        .setURL(manga.data.ext_urls[0])
                        .setImage(manga.header.thumbnail)
                        .addFields({
                            name: `Manga: `,
                            value: `${manga.data.source}`
                        },
                            {
                                name: `Author & Artist:`,
                                value: ` ${manga.data.artist} ${manga.data.author}`
                            },
                            {
                                name: `Số tập:`,
                                value: `${manga.data.part == '' ? 'Không rõ' : manga.data.part}`
                            })
                        .setFooter(`Độ chính xác: ${manga.header.similarity}`)
                        .setColor(`#00AAF`)
                    message.channel.send(embed)
                });
        }


        //if message reply
        if (message.reference) {
            message.channel.messages.fetch(message.reference.messageID).then(message => {
                //check if img is attached
                if (message.attachments.size > 0) {
                    let image = message.attachments.first().url;
                    // console.log('message is attached ', image)
                    fetchData(image)
                }
                //check if img is embed
                else if (message.embeds.length > 0) {
                    let image = `${message.embeds[0].thumbnail.url}`;
                    fetchData(image)
                    // console.log('message is embed ', message.embeds[0].thumbnail.url)
                } else {
                    message.channel.send(`Có lỗi trong quá trình tìm kiếm manga, có chắc bạn đã thực hiện đúng thao tác?`)
                }
            });
        }
        else {
            if (message.attachments.size > 0) {
                let image = message.attachments.first().url;
                fetchData(image)
            } else {
                message.channel.send(`Có lỗi trong quá trình tìm kiếm manga, có chắc bạn đã thực hiện đúng thao tác?`)
            }
        }

    })//command
}//module