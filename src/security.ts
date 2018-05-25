import * as crypto from 'crypto';
import * as requestPromise from 'request-promise';
import config from './config';

/**
 * Creates a HMAC SHA-256 hash created from the app TOKEN and
 * your app Consumer Secret.
 * @param crcToken - The token provided by the incoming GET request.
 * @param consumerSecret - The consumer secret of this application from apps.twitter.com.
 */
export function getChallengeResponse(crcToken: string, consumerSecret: string) {
	return crypto.createHmac('sha256', consumerSecret).update(crcToken).digest('base64');
}

/**
 * See https://developer.twitter.com/en/docs/accounts-and-users/subscribe-account-activity/guides/securing-webhooks
 * @param bodyPayload - The raw string body of the incoming webhook POST request.
 * @param consumerSecret - The consumer secret of this application from apps.twitter.com.
 * @param headerDigest - The digest provided by the x-twitter-webhooks-signature on the request.
 */
export function validateSignatureHeader(bodyPayload: string, consumerSecret: string, headerDigest: string | undefined) {
	if (!headerDigest) {
		return false;
	}

	const computedDigest = crypto.createHmac('sha256', consumerSecret).update(bodyPayload).digest('base64');
	console.log('headerDigest:', headerDigest);
	console.log('computedDigest:', computedDigest);
	return crypto.timingSafeEqual(Buffer.from(computedDigest), Buffer.from(headerDigest));
}

let bearerToken: string;
export async function getTwitterBearerToken() {
	// Just return the bearer token if we already have one.
	if (bearerToken) {
		return bearerToken;
	}

	const jsonResponseBody = await requestPromise({
		url: 'https://api.twitter.com/oauth2/token',
		method: 'POST',
		auth: {
			user: config.get('twitter').consumerKey,
			pass: config.get('twitter').consumerSecret
		},
		form: {
			grant_type: 'client_credentials'
		},
		json: true
	});

	bearerToken = jsonResponseBody.access_token;
	return bearerToken;
}
