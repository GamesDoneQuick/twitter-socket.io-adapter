"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socketIO = require("socket.io");
const SocketIOAuth = require("socketio-auth");
const uuid = require("uuid/v4");
const log_1 = require("./log");
const config_1 = require("./config");
exports.ACTIVITY_EVENT = 'activity_event_' + uuid();
/**
 * Initilaizes socket.io
 */
function init(server) {
    const ioServer = socketIO(server);
    SocketIOAuth(ioServer, {
        authenticate(_socket, data, callback) {
            process.nextTick(() => {
                callback(null, data.preSharedKey === config_1.default.get('secretKey'));
            });
        },
        postAuthenticate(socket) {
            log_1.default.debug(`Client ${socket.id} authenticated.`);
        },
        disconnect(socket) {
            log_1.default.debug(`Client ${socket.id} disconnected.`);
        },
        timeout: 1000
    });
    // connect and disconnect handlers
    ioServer.on('connection', socket => {
        log_1.default.debug(`Client ${socket.id} connected.`);
    });
    return ioServer;
}
exports.init = init;
//# sourceMappingURL=socket.js.map