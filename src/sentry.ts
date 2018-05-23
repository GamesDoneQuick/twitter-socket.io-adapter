import * as Raven from 'raven';
import config from './config';
import log from './log';

const sentryConfig = config.get('sentry');

if (sentryConfig && sentryConfig.dsn && process.env.HEROKU_SLUG_COMMIT) {
	Raven.config(sentryConfig.dsn, {
		// Requires that the experimental "dyno metadata" feature be enabled for this app.
		// See https://devcenter.heroku.com/articles/dyno-metadata for instructions.
		release: process.env.HEROKU_SLUG_COMMIT
	}).install();

	process.on('unhandledRejection', err => {
		err.message = `Unhandled promise rejection: ${err.message}`;
		log.error(err);
		Raven.captureException(err);
	});

	log.info('Sentry enabled.');
}
