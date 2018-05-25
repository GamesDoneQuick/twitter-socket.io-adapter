# twitter-socket.io-adapter [![Build Status](https://travis-ci.org/GamesDoneQuick/twitter-socket.io-adapter.svg?branch=master)](https://travis-ci.org/GamesDoneQuick/twitter-socket.io-adapter)
[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)  

A microservice which translates Twitter's new WebHook-based API into a Socket.IO-based one.

This application requires that Heroku's experimental "dyno metadata" feature be enabled for your deployment of this app.
See https://devcenter.heroku.com/articles/dyno-metadata for instructions.

# Motivation

Twitter's new Account Activity API is based on WebHooks. That's great, unless your application is behind a firewall and you can't forward any ports (which is the case for the NodeCG instances on-site at GDQ events).

This small microservice creates a Socket.IO server which translates these incoming WebHook POSTs into outgoing Socket.IO events. Since Socket.IO connections can be initiated from behind a firewall, the NodeCG instance on-site at GamesDoneQuick is able to connect and receive this realtime stream of events.

# Pre-Installation Setup

> 💡 If you already have a Twitter App which is set up for the Account Activity API, you may skip these steps.

1) [Apply for access to Twitter's "Premium" APIs](https://developer.twitter.com/en/apply-for-access)
2) Wait 3-5 business days to be approved.
3) Once approved, create an app at https://apps.twitter.com/
4) On the Permissions tab of your App, set "Access" to "Read, Write, and Access direct messages". 
    - This is the only access level supported by the new Account Activity API. Any lower access level will not work.
5) On the "Keys and Access Tokens" tab of your App, generate a Consumer Key, Consumer Secret, Access Token, and Access Token Secret.
    - Ensure that the "Access Level" for both of these is "Read, write, and direct messages"
6) Save those four strings (Consumer Key, Consumer Secret, Access Token, and Access Token Secret) for later in the setup process.
7) Go to the ["Environments" page of the Twitter Developer Dashboard](https://developer.twitter.com/en/account/environments).
8) Click "Set up dev environment" under "Account Activity API"
9) Give it whatever name you like, and save this name for later in the setup process.

# Installation

1) Click the "Deploy to Heroku" button at the top of this README.
2) Fill out the environment variables using the values you created & saved in the steps above.
    - `SENTRY_DSN` is optional. Check out https://sentry.io/ if you're unfamiliar with Sentry.
3) Click "Deploy app" at the bottom of the page.
4) Once your app is deployed, go to its "Settings" page and click "Reveal Config Vars"
5) Note down the automatically-generated `SECRET_KEY` for later.

It is strongly recommended that you upgrade from the default "Free" dyno to a $7/mo "Hobby" dyno. This will prevent your dyno from sleeping, which could cause it to miss events or have high latency.

# Usage (Node.js)

First, you will need to install `socket.io-client` as a dependency of your Node.js project:
```bash
npm install --save socket.io-client
```

Then, you can set up the socket with code like the following:
```js
const io = require('socket.io-client');
const socket = io.connect('https://your-heroku-app-name.herokuapp.com');
socket.on('connect', () => {    
    socket.on('authenticated', () => {
        console.log('Twitter socket authenticated.');
    });
    
    socket.on('unauthorized', err => {
        console.log('There was an error with the authentication:', err.message);
    });
    
    socket.on('twitter-webhook-payload', payload => {
    	// `payload` will be an object in the format described here:
    	// https://developer.twitter.com/en/docs/accounts-and-users/subscribe-account-activity/guides/account-activity-data-objects
    });
    
    socket.emit('authentication', {preSharedKey: 'your SECRET_KEY from earlier'});
});
```

