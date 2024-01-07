const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
    first_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    second_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    messages: [
        {
            sender: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "user",
                required: true,
            },
            content: {
                type: String,
                required: true,
            },
            timestamp: {
                type: Date,
                default: Date.now(),
            },
        },
    ],
});

module.exports = mongoose.model("chat", chatSchema);