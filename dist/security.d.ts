/**
 * Creates a HMAC SHA-256 hash created from the app TOKEN and
 * your app Consumer Secret.
 * @param crcToken - The token provided by the incoming GET request.
 * @param consumerSecret - The consumer secret of this application from apps.twitter.com.
 */
export declare function getChallengeResponse(crcToken: string, consumerSecret: string): string;
/**
 * See https://developer.twitter.com/en/docs/accounts-and-users/subscribe-account-activity/guides/securing-webhooks
 * @param bodyPayload - The raw string body of the incoming webhook POST request.
 * @param consumerSecret - The consumer secret of this application from apps.twitter.com.
 * @param headerDigest - The digest provided by the x-twitter-webhooks-signature on the request.
 */
export declare function validateSignatureHeader(bodyPayload: string, consumerSecret: string, headerDigest: string | undefined): boolean;
export declare function getTwitterBearerToken(): Promise<string>;
