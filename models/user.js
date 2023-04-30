const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        immutable: true
    },
    message: {
        type: String,
        immutable: true
    }
})

module.exports = mongoose.model("User", userSchema)