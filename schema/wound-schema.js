const mongoose = require('mongoose')

const reqString = {
    type: String,
    required: true
}

const woundSchema = mongoose.Schema({
    userId: reqString,
    guildId: reqString,
    expires: {
        type: Date,
        required: true
    },
    current: {
        type: Boolean,
        required: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('wound-db', woundSchema)