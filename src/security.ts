import * as crypto from 'crypto';

/**
 * Creates a HMAC SHA-256 hash created from the app TOKEN and
 * your app Consumer Secret.
 * @param crcToken - The token provided by the incoming GET request.
 * @param consumerSecret - The consumer secret of this application from apps.twitter.com.
 * @return string
 */
export function getChallengeResponse(crcToken: string, consumerSecret: string) {
	return crypto.createHmac('sha256', consumerSecret).update(crcToken).digest('base64');
}
