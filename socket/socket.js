const SocketIoServer = require('socket.io');

module.exports = class SocketServer {
    constructor(server, options) {
        this.io = new SocketIoServer(server, options);
    }

    use(name, fn) {
        if (!name) return false;
        if (typeof name === 'string') {
            if (!fn) return false;
            if (typeof fn !== 'function') throw new TypeError('middleware must be a function!');

            this.io.of(name).on('connection', fn);
        } else if (typeof name === 'function') {
            this.io.on('connection', fn);
        }
    }
};
