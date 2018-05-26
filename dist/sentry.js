"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Raven = require("raven");
const config_1 = require("./config");
const log_1 = require("./log");
const sentryConfig = config_1.default.get('sentry');
function init(app) {
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
        app.use(Raven.requestHandler());
        app.use(Raven.errorHandler());
        log_1.default.info('Sentry enabled.');
    }
    else {
        log_1.default.info('Sentry is disabled.');
    }
}
exports.init = init;
//# sourceMappingURL=sentry.js.map