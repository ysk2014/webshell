const SocketServer = require('./socket');
const terminal = require('./terminal');

module.exports = server => {
    const socketServer = new SocketServer(server);

    socketServer.use('terminal', terminal);
};
