const mongoose = require('mongoose');
require('dotenv').config();

const mongoPath = `mongodb+srv://violetBot:${process.env.MONGO_PW}@violet-bot.prlnm.mongodb.net/violetDB?retryWrites=true&w=majority`


module.exports = async () => {
    await mongoose.connect(mongoPath, {
        keepAlive: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })

    return mongoose
}