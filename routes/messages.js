const express = require("express");
const Chat = require("../model/chat");
const router = express.Router();
const auth = require("../middleware/auth");

router.get("/:chat_id", async (req, res) => {
    var chat_id = req.params["chat_id"];

    Chat.findById(chat_id)
        .then((result) => {
            res.status(200).json({"messages": result.messages});
        })
        .catch((error) => {
            res.status(500).json({"error": error});
        });
});

module.exports = router;