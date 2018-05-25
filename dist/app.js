"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bodyParser = require("body-parser");
const config_1 = require("./config");
const express = require("express");
const requestPromise = require("request-promise");
const security = require("./security");
const socket = require("./socket");
const uuid = require("uuid/v4");
const log_1 = require("./log");
require("./sentry"); // tslint:disable-line:no-import-side-effect
const app = express();
app.set('port', (process.env.PORT || 5000));
function rawBodySaver(req, _res, buf, encoding) {
    if (buf && buf.length) {
        req.rawBody = buf.toString(encoding || 'utf8');
    }
}
app.use(bodyParser.json({ verify: rawBodySaver }));
app.use(bodyParser.urlencoded({ extended: true, verify: rawBodySaver }));
// start server
const server = app.listen(app.get('port'), () => {
    log_1.default.info('Node app is running on port', app.get('port'));
});
// initialize socket.io
const ioServer = socket.init(server);
/**
 * Receives challenge response check (CRC)
 */
app.get('/webhook/twitter', (request, response) => {
    const crc_token = request.query.crc_token;
    if (crc_token) {
        const hash = security.getChallengeResponse(crc_token, config_1.default.get('twitter').consumerSecret);
        response.status(200);
        response.send({
            response_token: 'sha256=' + hash
        });
    }
    else {
        response.status(400);
        response.send('Error: crc_token missing from request.');
    }
});
/**
 * Receives Account Activity events
 */
app.post('/webhook/twitter', (request, response) => {
    const authenticated = security.validateSignatureHeader(request.rawBody, config_1.default.get('twitter').consumerSecret, request.header('x-twitter-webhooks-signature'));
    if (!authenticated) {
        log_1.default.warn('Unauthorized webhook POST from hostname "%s" (remoteAddress: %s):', request.hostname, request.connection.remoteAddress, request.body);
        response.sendStatus(401);
        return;
    }
    log_1.default.info('Authorized webhook POST:', request.body);
    ioServer.emit(socket.ACTIVITY_EVENT, {
        internal_id: uuid(),
        event: request.body
    });
    response.sendStatus(200);
});
/**
 * Serves the home page
 */
app.get('/', (_request, response) => {
    response.send('Hello world.\n');
});
init().catch(error => {
    log_1.default.error('Failed to init:', error);
});
async function init() {
    const webhookUrl = `https://${process.env.HEROKU_APP_NAME}.herokuapp.com/webhook/twitter`;
    const oauth = {
        consumer_key: config_1.default.get('twitter').consumerKey,
        consumer_secret: config_1.default.get('twitter').consumerSecret,
        token: config_1.default.get('twitter').accessToken,
        token_secret: config_1.default.get('twitter').accessTokenSecret
    };
    const bearerToken = await security.getTwitterBearerToken();
    const existingWebhooks = await requestPromise.get({
        url: `https://api.twitter.com/1.1/account_activity/all/${config_1.default.get('twitter').env}/webhooks.json`,
        auth: {
            bearer: bearerToken
        },
        json: true
    });
    log_1.default.info('existingWebhooks:', existingWebhooks);
    // If our Webhook is already registered, just trigger a CRC for it.
    // Else, register it now.
    const existingWebhook = existingWebhooks.find((webhook) => webhook.url === webhookUrl);
    if (existingWebhook) {
        await requestPromise.put({
            url: `https://api.twitter.com/1.1/account_activity/all/${config_1.default.get('twitter').env}/webhooks/${existingWebhook.id}`,
            oauth
        });
    }
    else {
        await requestPromise.post({
            url: `https://api.twitter.com/1.1/account_activity/all/${config_1.default.get('twitter').env}/webhooks.json`,
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
        url: `https://api.twitter.com/1.1/account_activity/all/${config_1.default.get('twitter').env}/subscriptions.json`,
        oauth
    });
}
//# sourceMappingURL=app.js.map