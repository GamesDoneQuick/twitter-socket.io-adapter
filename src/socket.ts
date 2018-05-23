import * as socketIO from 'socket.io';
import * as uuid from 'uuid/v4';
import * as http from 'http';

export const ACTIVITY_EVENT = 'activity_event_' + uuid();

/**
 * Initilaizes socket.io
 */
export function init(server: http.Server) {
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
