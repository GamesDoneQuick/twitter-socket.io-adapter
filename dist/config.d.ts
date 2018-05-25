import * as convict from 'convict';
declare const conf: convict.Config<{
    logLevel: string;
    twitter: {
        consumerKey: any;
        consumerSecret: any;
        accessToken: any;
        accessTokenSecret: any;
        env: any;
    };
    sentry: {
        dsn: any;
    };
    secretKey: string;
}>;
export default conf;
