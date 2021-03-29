const economy = require('@features/economy')

module.exports = {
    commands: ['dun'],
    expectedArgs: "None",
    permissionError: 'You must be an admin to use this command',
    description: "Reaction",
    permissions: 'ADMINISTRATOR',
    callback: async (message, arguments) => {

        const guildId = message.guild.id
        const userId = message.author.id

        // const quiz = [
        //     {
        //         "question": "Choice 1",
        //         "answers": [1, 2, 3]
        //     },
        //     {
        //         "question": "Choice 2",
        //         "answers": [1, 2, 3]
        //     }
        // ];

        // const item = quiz[Math.floor(Math.random() * quiz.length)];

        // const filter = response => {
        //     if (response.author.id === '367117809920114688') {
        //         return item.answers.some(answer => answer === parseInt(response.content.replace(/[^0-9]/g, '')));
        //     }
        // };

        // message.channel.send(item.question).then(() => {
        //     message.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] })
        //         .then(collected => {
        //             message.channel.send(`${collected.first().author} got the correct answer!`);
        //             // console.log('collected message ', collected)
        //         })
        //         .catch(collected => {
        //             message.channel.send('Looks like nobody got the answer this time.');
        //         });
        // });





    }
}