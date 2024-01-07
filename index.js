require("./config/database").connect();

const http = require("http");
const app = require("./app");
const socketIo = require("socket.io");
const httpServer = http.createServer(app);
const verifyTokenSocket = require("./middleware/authsocket");
const User = require("./model/user");
const Chat = require("./model/chat");

const { API_PORT } = process.env;
const port = process.env.PORT || API_PORT;

const io = socketIo(httpServer);

io.use(verifyTokenSocket);

io.on("connection", async (socket) => {
    socket.on("register", (username) => {
        console.log(username + " connecté");
        socket.username = username;
        activeUsers[username] = socket.id;
    });

    const from = await User.find({username: username});

    socket.on("private message", async (req, res, data) => {
        const {to, messageContent} = data;
        const toSocketId = activeUsers[to];
        if (toSocketId) {
            io.to(toSocketId).emit("private message", {from: socket.username, content});

            var chat = await Chat.find({to, from});

            if (!chat) {
                var chat = await Chat.find({from, to});
            }

            try {
                const newMessage = {
                  sender: to,
                  content: messageContent,
                };
            
                chat.messages.push(newMessage);
            
                await chat.save();
            
                res.status(200).send("Message envoyé avec succès!");
              } catch (error) {
                throw error;
              }
        }
    });

    socket.on("disconnect", () => {
        console.log("Un utilsateur s'est déconnecté");
        delete activeUsers[socket.username];
    });
});

httpServer.listen(port, () => {
    console.log(`Server running on port ${port}`);
})