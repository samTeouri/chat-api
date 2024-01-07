const express = require("express");
const router = express.Router();
const User = require("../model/user");
const Chat = require("../model/chat");
const auth = require("../middleware/auth");

router.get("/:user_id", (req, res) => {
    var user_id = req.params["user_id"];
    var user = User.findById(user_id)
        .then(() => {
            console.log("User retrieved with success,");
        })
        .catch((error) => {
            res.json(error);
        });
    
    var chat = Chat.find({
        $or: [
            {first_user: user_id},
            {second_user: user_id}
        ]
    })
    .then((results) => {
        res.send(results);
    })
    .catch((error) => {
        res.send(error);
    });
});

module.exports = router;