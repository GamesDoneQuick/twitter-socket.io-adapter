import * as bodyParser from 'body-parser';
import config from './config';
import * as express from 'express';
import * as requestPromise from 'request-promise';
import * as security from './security';
import * as socket from './socket';
import log from './log';
import * as Sentry from './sentry'; // tslint:disable-line:no-import-side-effect

const app = express();

app.set('port', (process.env.PORT || 5000));
Sentry.init(app);

function rawBodySaver(req: Express.Request, _res: Express.Response, buf: Buffer, encoding: string) {
	if (buf && buf.length) {
		(req as any).rawBody = buf.toString(encoding || 'utf8');
	}
}

app.use(bodyParser.json({verify: rawBodySaver}));
app.use(bodyParser.urlencoded({extended: true, verify: rawBodySaver}));

// start server
const server = app.listen(app.get('port'), () => {
	log.info('Node app is running on port', app.get('port'));
});

// initialize socket.io
const ioServer = socket.init(server);

/**
 * Receives challenge response check (CRC)
 */
app.get('/webhook/twitter', (request, response) => {
	const crc_token = request.query.crc_token;

	if (crc_token) {
		const hash = security.getChallengeResponse(crc_token, config.get('twitter').consumerSecret);

		response.status(200);
		response.send({
			response_token: 'sha256=' + hash
		});
	} else {
		response.status(400);
		response.send('Error: crc_token missing from request.');
	}
});

/**
 * Receives Account Activity events
 */
app.post('/webhook/twitter', (request, response) => {
	const authenticated = security.validateSignatureHeader(
		(request as any).rawBody,
		config.get('twitter').consumerSecret,
		request.header('x-twitter-webhooks-signature')
	);

	if (!authenticated) {
		log.warn(
			'Unauthorized webhook POST from hostname "%s" (remoteAddress: %s):',
			request.headers.host,
			request.connection.remoteAddress,
			request.body
		);
		response.sendStatus(401);
		return;
	}

	log.info(
		'Authorized webhook POST from hostname "%s" (remoteAddress: %s).',
		request.headers.host,
		request.connection.remoteAddress
	);

	log.debug(request.body);

	ioServer.emit('twitter-webhook-payload', request.body);

	response.sendStatus(200);
});

/**
 * Serves the home page
 */
app.get('/', (_request, response) => {
	response.send('Hello world.\n');
});

init().catch(error => {
	log.error('Failed to init:', error);
});

async function init() {
	const webhookUrl = `https://${process.env.HEROKU_APP_NAME}.herokuapp.com/webhook/twitter`;
	const oauth = {
		consumer_key: config.get('twitter').consumerKey,
		consumer_secret: config.get('twitter').consumerSecret,
		token: config.get('twitter').accessToken,
		token_secret: config.get('twitter').accessTokenSecret
	};

	const bearerToken = await security.getTwitterBearerToken();

	const existingWebhooks = await requestPromise.get({
		url: `https://api.twitter.com/1.1/account_activity/all/${config.get('twitter').env}/webhooks.json`,
		auth: {
			bearer: bearerToken
		},
		json: true
	});

	log.info('existingWebhooks:', existingWebhooks);

	// If our Webhook is already registered, just trigger a CRC for it.
	// Else, register it now.
	const existingWebhook = existingWebhooks.find((webhook: any) => webhook.url === webhookUrl);
	if (existingWebhook) {
		if (config.get('twitter').deleteWebhook) {
			log.info(`Deleting webhook ${existingWebhook.id}...`);
			await requestPromise.delete({
				url: `https://api.twitter.com/1.1/account_activity/all/${config.get('twitter').env}/webhooks/${existingWebhook.id}.json`,
				oauth
			});
			log.info(`Webhook ${existingWebhook.id} deleted.`);
			log.info('Set TWITTER_DELETE_WEBHOOK back to "false" and restart the program to register a new webhook.');
			return;
		}

		await requestPromise.put({
			url: `https://api.twitter.com/1.1/account_activity/all/${config.get('twitter').env}/webhooks/${existingWebhook.id}.json`,
			oauth
		});
	} else {
		if (config.get('twitter').deleteWebhook) {
			log.info('No existing webhooks found.');
			log.info('Set TWITTER_DELETE_WEBHOOK back to "false" and restart the program to register a new webhook.');
			return;
		}

		await requestPromise.post({
			url: `https://api.twitter.com/1.1/account_activity/all/${config.get('twitter').env}/webhooks.json`,
			oauth,
			headers: {
				'Content-type': 'application/x-www-form-urlencoded'
			},
			form: {
				url: webhookUrl
			}
		});
	}

	await requestPromise.post({
		url: `https://api.twitter.com/1.1/account_activity/all/${config.get('twitter').env}/subscriptions.json`,
		oauth
	});
}
