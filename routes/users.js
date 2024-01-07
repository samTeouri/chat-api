const express = require("express");
const router = express.Router();
const User = require("../model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

router.post("/register", async function(req, res) {

    try {
        const { first_name, username, last_name, email, password } = req.body;

        if (!(email && password && username && first_name && last_name)) {
            res.status(400).send("All input is required");
        }

        const oldUser = await User.findOne({ email });
    
        if (oldUser) {
            return res.status(409).send("User Already Exist. Please Login");
        }

        encryptedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            first_name,
            last_name,
            username,
            email: email.toLowerCase(),
            password: encryptedPassword,
        });

        const token = jwt.sign(
            { user_id: user._id, email },
            process.env.TOKEN_KEY,
            {
            expiresIn: "2h",
            }
        );
        user.token = token;

        res.status(201).json(user);
    } catch (err) {
        console.log(err);
    }
});

router.post("/login", async function(req, res) {

    try {
      const { email, password } = req.body;
  
      if (!(email && password)) {
        res.status(400).send("All input is required");
      }
      const user = await User.findOne({ email });
  
      if (user && (await bcrypt.compare(password, user.password))) {
        const token = jwt.sign(
          { user_id: user._id, email },
          process.env.TOKEN_KEY,
          {
            expiresIn: "2h",
          }
        );
        user.token = token;
        res.status(200).json(user);
      }
      res.status(400).send("Invalid Credentials");
    } catch (err) {
      console.log(err);
    }
});

router.get("/profile/:user_id", async (req, res) => {
    var user_id = req.params["user_id"];
    User.findById(user_id)
        .then((result) => {
            res.status(200).json({"user": result});
        }).catch((error) => {
            res.status(500).json({"error": error});
        }); 
});

module.exports = router;
