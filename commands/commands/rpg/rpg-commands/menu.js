
let menuImport = require('@util/rpg/announcement-template/template')

//main
module.exports = {
    commands: ['help'],
    expectedArgs: "None",
    permissionError: 'Bạn phải là adventure để có thể sử dụng lệnh này',
    description: "",
    requiredRoles: ['adventure'],
    callback: async (message) => {

        let menu = menuImport.getList()
        let page = 1

        message.channel.send(menu[0].setFooter(`Trang ${page} của ${menu.length}`)).then(msg => {
            msg.react('⬅').then(r => {
                msg.react('➡')

                // Filters
                const backwardsFilter = (reaction, user) => reaction.emoji.name === '⬅' && user.id === message.author.id
                const forwardsFilter = (reaction, user) => reaction.emoji.name === '➡' && user.id === message.author.id

                const backwards = msg.createReactionCollector(backwardsFilter, { timer: 6000 })
                const forwards = msg.createReactionCollector(forwardsFilter, { timer: 6000 })

                backwards.on('collect', (r, u) => {
                    if (page === 1) return r.users.remove(r.users.cache.filter(u => u === message.author).first())
                    page--
                    msg.edit(menu[page - 1].setFooter(`Trang ${page} của ${menu.length}`))
                    r.users.remove(r.users.cache.filter(u => u === message.author).first())
                })

                forwards.on('collect', (r, u) => {
                    if (page === menu.length) return r.users.remove(r.users.cache.filter(u => u === message.author).first())
                    page++
                    msg.edit(menu[page - 1].setFooter(`Trang ${page} của ${menu.length}`))
                    r.users.remove(r.users.cache.filter(u => u === message.author).first())
                })
            })
        })

    }
}