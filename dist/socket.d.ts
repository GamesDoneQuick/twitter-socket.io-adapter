/// <reference types="node" />
import * as socketIO from 'socket.io';
import * as http from 'http';
/**
 * Initilaizes socket.io
 */
export declare function init(server: http.Server): socketIO.Server;
