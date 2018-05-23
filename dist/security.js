"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = require("crypto");
/**
 * Creates a HMAC SHA-256 hash created from the app TOKEN and
 * your app Consumer Secret.
 * @param crcToken - The token provided by the incoming GET request.
 * @param consumerSecret - The consumer secret of this application from apps.twitter.com.
 * @return string
 */
function getChallengeResponse(crcToken, consumerSecret) {
    return crypto.createHmac('sha256', consumerSecret).update(crcToken).digest('base64');
}
exports.getChallengeResponse = getChallengeResponse;
function validateSignatureHeader(bodyPayload, consumerSecret, headerDigest) {
    if (!headerDigest) {
        return false;
    }
    const computedDigest = crypto.createHmac('sha256', consumerSecret).update(bodyPayload).digest('base64');
    return crypto.timingSafeEqual(Buffer.from(computedDigest), Buffer.from(headerDigest));
}
exports.validateSignatureHeader = validateSignatureHeader;
//# sourceMappingURL=security.js.map