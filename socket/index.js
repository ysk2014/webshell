const SocketServer = require('./socket');
const terminal = require('./terminal');

module.exports = server => {
    const socketServer = new SocketServer(server, {
        pingTimeout: 1000 * 60 * 60 * 24
    });

    socketServer.use('terminal', terminal);
};
