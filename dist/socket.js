"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socketIO = require("socket.io");
const uuid = require("uuid/v4");
exports.ACTIVITY_EVENT = 'activity_event_' + uuid();
/**
 * Initilaizes socket.io
 */
function init(server) {
    const ioServer = socketIO(server);
    // connect and disconnect handlers
    ioServer.on('connection', s => {
        console.log('Client connected');
        s.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });
    return ioServer;
}
exports.init = init;
//# sourceMappingURL=socket.js.map