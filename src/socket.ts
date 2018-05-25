import * as socketIO from 'socket.io';
import * as SocketIOAuth from 'socketio-auth';
import * as http from 'http';
import log from './log';
import config from './config';

/**
 * Initilaizes socket.io
 */
export function init(server: http.Server) {
	const ioServer = socketIO(server);

	SocketIOAuth(ioServer, {
		authenticate(_socket: socketIO.Socket, data: {[key: string]: any}, callback: Function) {
			process.nextTick(() => {
				callback(null, data.preSharedKey === config.get('secretKey'));
			});
		},
		postAuthenticate(socket: socketIO.Socket) {
			log.debug(`Client ${socket.id} authenticated.`);
		},
		disconnect(socket: socketIO.Socket) {
			log.debug(`Client ${socket.id} disconnected.`);
		},
		timeout: 1000
	});

	// connect and disconnect handlers
	ioServer.on('connection', socket => {
		log.debug(`Client ${socket.id} connected.`);
	});

	return ioServer;
}
