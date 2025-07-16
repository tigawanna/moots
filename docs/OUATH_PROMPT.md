current setup it working and logging me in but it redirects me to an error screen and i get failed to find update errors

OAuth authentication allows users to log in using accounts from other popular services. This can be convenient for users because they can start using your app without creating a new account. It can also be more secure, because the user has one less password that could become vulnerable.

When using OAuth to authenticate, the authentication request is initiated from the client application. The user is then redirected to an OAuth 2 provider to complete the authentication step, and finally, the user is redirected back to the client application.

Identities and OAuth2
OAuth2 login creates an identity in Appwrite, allowing users to connect multiple providers to a single account. Learn more in Identities.

Configure OAuth 2 login
Before using OAuth 2 login, you need to enable and configure an OAuth 2 login provider.

Navigate to your Appwrite project.

Navigate to Auth > Settings.

Find and open the OAuth provider.

In the OAuth 2 settings modal, use the toggle to enable the provider.

Create and OAuth 2 app on the provider's developer platform.

Copy information from your OAuth2 provider's developer platform to fill the OAuth2 Settings modal in the Appwrite Console.

Configure redirect URL in your OAuth 2 provider's developer platform. Set it to URL provided to you by OAuth2 Settings modal in Appwrite Console.

Initialize OAuth 2 login
To initialize the OAuth 2 login process, use the Create OAuth 2 Session route.

OAuth2 sessions allow you to specify the scope of the access you want to request from the OAuth2 provider. The requested scopes describe which resources a session can access.

You can pass the scopes to request through the scopes parameter when creating a session. The scope is provider-specific and can be found in the provider's documentation.

Javascript
Flutter
Apple
Android
React Native
If using Expo, set the URL scheme to appwrite-callback-<PROJECT_ID> in your app.json file.

JSON

{
  "expo": {
    "scheme": "appwrite-callback-<PROJECT_ID>"
  }
}
Then, create a deep link, pass it to account.createOAuth2Token() method to create the login URL, open the URL in a browser, listen for the redirect, and finally create a session with the secret.

React Native

import { Client, Account, OAuthProvider } from "appwrite";
import { makeRedirectUri } from 'expo-auth-session'
import * as WebBrowser from 'expo-web-browser';

const client = new Client()
    .setEndpoint('https://<REGION>.cloud.appwrite.io/v1') // Your API Endpoint
    .setProject('<PROJECT_ID>');                          // Your project ID

const account = new Account(client);

// Create deep link that works across Expo environments
// Ensure localhost is used for the hostname to validation error for success/failure URLs
const deepLink = new URL(makeRedirectUri({ preferLocalhost: true }));
const scheme = `${deepLink.protocol}//`; // e.g. 'exp://' or 'appwrite-callback-<PROJECT_ID>://'

// Start OAuth flow
const loginUrl = await account.createOAuth2Token(
    provider,
    `${deepLink}`,
    `${deepLink}`,
);

// Open loginUrl and listen for the scheme redirect
const result = await WebBrowser.openAuthSessionAsync(`${loginUrl}`, scheme);

// Extract credentials from OAuth redirect URL
const url = new URL(result.url);
const secret = url.searchParams.get('secret');
const userId = url.searchParams.get('userId');

// Create session with OAuth credentials
await account.createSession(userId, secret);
// Redirect as needed
You'll be redirected to the OAuth 2 provider's login page to log in. Once complete, your user will be redirected back to your app.

You can optionally configure success or failure redirect links on web to handle success and failure scenarios.

OAuth 2 profile
After authenticating a user through their OAuth 2 provider, you can fetch their profile information such as their avatar image or name. To do this you can use the access token from the OAuth 2 provider and make API calls to the provider.

After creating an OAuth 2 session, you can fetch the session to get information about the provider.

Tip
Replace [SESSION_ID] with either "current" to get or update the active session, or with a specific session ID.


import { Client, Account } from "appwrite";

const client = new Client();

const account = new Account(client);

const session = await account.getSession('current');

// Provider information
console.log(session.provider);
console.log(session.providerUid);
console.log(session.providerAccessToken);
An OAuth 2 session will have the following attributes.

Property	Description
provider	The OAuth2 Provider.
providerUid	User ID from the OAuth 2 Provider.
providerAccessToken	Access token from the OAuth 2 provider. Use this to make requests to the OAuth 2 provider to fetch personal data.
providerAccessTokenExpiry	Check this value to know if an access token is about to expire.
You can use the providerAccessToken to make requests to your OAuth 2 provider. Refer to the docs for the OAuth 2 provider you're using to learn about making API calls with the access token.

Refresh tokens
OAuth 2 sessions expire to protect from security risks. This means the OAuth 2 session with a provider may expire, even when an Appwrite session remains active. OAuth 2 sessions should be refreshed periodically so access tokens don't expire.

Check the value of providerAccessTokenExpiry to know if the token is expired or is about to expire. You can refresh the provider session by calling the Update OAuth Session endpoint whenever your user visits your app. Avoid refreshing before every request, which might cause rate limit problems.


const promise = account.updateSession('[SESSION_ID]');

promise.then(function (response) {
    console.log(response); // Success
}, function (error) {
    console.log(error); // Failure
});

#fetch https://github.com/appwrite/sdk-for-react-native/issues/34#issuecomment-2654940715
