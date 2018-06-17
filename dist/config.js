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
        },
        env: {
            doc: 'Twitter API environment to use',
            format: String,
            default: '',
            env: 'TWITTER_API_ENV',
            arg: 'twitterApiEnv'
        },
        deleteWebhook: {
            doc: 'If true, deletes any existing webhook for this URL, and does not set up a new one. This is meant to be used for one-time cleanup.',
            format: Boolean,
            default: false,
            env: 'TWITTER_DELETE_WEBHOOK',
            arg: 'twitterDeleteWebhook'
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
    },
    secretKey: {
        doc: 'The pre-shared secret key that sockets must provide for them to remain connected and receive data.',
        format: String,
        default: '',
        env: 'SECRET_KEY',
        arg: 'secretKey'
    }
});
if (fs.existsSync('./config.json')) {
    conf.loadFile('./config.json');
}
// Perform validation
conf.validate({ allowed: 'strict' });
exports.default = conf;
//# sourceMappingURL=config.js.map