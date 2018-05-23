"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const convict = require("convict");
const conf = convict({
    logLevel: {
        doc: 'The level at which to log info',
        format: ['trace', 'debug', 'info', 'warn', 'error'],
        default: 'info',
        env: 'LOG_LEVEL',
        arg: 'logLevel'
    },
    twitter: {
        consumerKey: {
            doc: 'Twitter API consumer key',
            format: String,
            default: '',
            env: 'TWITTER_CONSUMER_KEY',
            arg: 'twitterConsumerKey'
        },
        consumerSecret: {
            doc: 'Twitter API consumer secret',
            format: String,
            default: '',
            env: 'TWITTER_CONSUMER_SECRET',
            arg: 'twitterConsumerSecret'
        },
        accessToken: {
            doc: 'Twitter API access token',
            format: String,
            default: '',
            env: 'TWITTER_ACCESS_TOKEN',
            arg: 'twitterAccessTokenKey'
        },
        accessTokenSecret: {
            doc: 'Twitter API access token secret',
            format: String,
            default: '',
            env: 'TWITTER_ACCESS_TOKEN_SECRET',
            arg: 'twitterAccessTokenSecret'
        }
    },
    sentry: {
        dsn: {
            doc: 'The Data Source Name to use when reporting errors to Sentry.io',
            format: String,
            default: '',
            env: 'SENTRY_DSN',
            arg: 'sentryDsn'
        }
    }
});
if (fs.existsSync('./config.json')) {
    conf.loadFile('./config.json');
}
// Perform validation
conf.validate({ strict: true });
exports.default = conf;
//# sourceMappingURL=config.js.map