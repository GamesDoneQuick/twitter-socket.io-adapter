/// <reference types="node" />
import * as socketIO from 'socket.io';
import * as http from 'http';
export declare const ACTIVITY_EVENT: string;
/**
 * Initilaizes socket.io
 */
export declare function init(server: http.Server): socketIO.Server;
