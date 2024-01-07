const jwt = require('jsonwebtoken');

config = process.env

const verifyTokenSocket = (socket, next) => {
  const token = socket.handshake.query.token;

  if (!token) {
    return next(new Error('Authentication failed: Missing token'));
  }

  jwt.verify(token, config.TOKEN_KEY, (err, decoded) => {
    if (err) {
      return next(new Error('Authentication failed: Invalid token'));
    }

    socket.user = decoded.user;
    next();
  });
}

module.exports = verifyTokenSocket;
