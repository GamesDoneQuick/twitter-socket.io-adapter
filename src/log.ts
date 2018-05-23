import * as winston from 'winston';
import * as fs from 'fs';
import * as path from 'path';
import config from './config';
import 'winston-daily-rotate-file'; // tslint:disable-line:no-import-side-effect

const logDir = path.resolve(__dirname, '../logs');
const LEVEL = config.get('logLevel') || 'info';

// Make log directory if it does not exist
if (!fs.existsSync(logDir)) {
	fs.mkdirSync(logDir);
}

winston.addColors({
	trace: 'green',
	debug: 'cyan',
	info: 'white',
	warn: 'yellow',
	error: 'red'
});

export default new (winston.Logger)({
	transports: [
		new (winston.transports.DailyRotateFile)({
			json: false,
			prettyPrint: true,
			filename: `${logDir}/log`,
			prepend: true,
			level: LEVEL
		}),
		new (winston.transports.Console)({
			prettyPrint: true,
			colorize: true,
			level: LEVEL
		})
	]
});
