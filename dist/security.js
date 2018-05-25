"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = require("crypto");
const requestPromise = require("request-promise");
const config_1 = require("./config");
/**
 * Creates a HMAC SHA-256 hash created from the app TOKEN and
 * your app Consumer Secret.
 * @param crcToken - The token provided by the incoming GET request.
 * @param consumerSecret - The consumer secret of this application from apps.twitter.com.
 */
function getChallengeResponse(crcToken, consumerSecret) {
    return crypto.createHmac('sha256', consumerSecret).update(crcToken).digest('base64');
}
exports.getChallengeResponse = getChallengeResponse;
/**
 * See https://developer.twitter.com/en/docs/accounts-and-users/subscribe-account-activity/guides/securing-webhooks
 * @param bodyPayload - The raw string body of the incoming webhook POST request.
 * @param consumerSecret - The consumer secret of this application from apps.twitter.com.
 * @param headerDigest - The digest provided by the x-twitter-webhooks-signature on the request.
 */
function validateSignatureHeader(bodyPayload, consumerSecret, headerDigest) {
    if (!headerDigest) {
        return false;
    }
    const computedDigest = crypto.createHmac('sha256', consumerSecret).update(bodyPayload).digest('base64');
    return crypto.timingSafeEqual(Buffer.from(computedDigest), Buffer.from(headerDigest));
}
exports.validateSignatureHeader = validateSignatureHeader;
let bearerToken;
async function getTwitterBearerToken() {
    // Just return the bearer token if we already have one.
    if (bearerToken) {
        return bearerToken;
    }
    const jsonResponseBody = await requestPromise({
        url: 'https://api.twitter.com/oauth2/token',
        method: 'POST',
        auth: {
            user: config_1.default.get('twitter').consumerKey,
            pass: config_1.default.get('twitter').consumerSecret
        },
        form: {
            grant_type: 'client_credentials'
        },
        json: true
    });
    bearerToken = jsonResponseBody.access_token;
    return bearerToken;
}
exports.getTwitterBearerToken = getTwitterBearerToken;
//# sourceMappingURL=security.js.map