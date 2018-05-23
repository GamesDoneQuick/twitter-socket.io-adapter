"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Raven = require("raven");
const config_1 = require("./config");
const log_1 = require("./log");
const sentryConfig = config_1.default.get('sentry');
if (sentryConfig && sentryConfig.dsn && process.env.HEROKU_SLUG_COMMIT) {
    Raven.config(sentryConfig.dsn, {
        // Requires that the experimental "dyno metadata" feature be enabled for this app.
        // See https://devcenter.heroku.com/articles/dyno-metadata for instructions.
        release: process.env.HEROKU_SLUG_COMMIT
    }).install();
    process.on('unhandledRejection', err => {
        err.message = `Unhandled promise rejection: ${err.message}`;
        log_1.default.error(err);
        Raven.captureException(err);
    });
    log_1.default.info('Sentry enabled.');
}
//# sourceMappingURL=sentry.js.map