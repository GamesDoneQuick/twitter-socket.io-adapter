"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston = require("winston");
const fs = require("fs");
const path = require("path");
const config_1 = require("./config");
require("winston-daily-rotate-file"); // tslint:disable-line:no-import-side-effect
const logDir = path.resolve(__dirname, '../logs');
const LEVEL = config_1.default.get('logLevel') || 'info';
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
exports.default = new (winston.Logger)({
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
//# sourceMappingURL=log.js.map