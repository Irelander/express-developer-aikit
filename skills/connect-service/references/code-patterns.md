# OAuth code patterns

## Core panel call

~~~js
const { id, code, redirectUri, result } = await addOnUISdk.app.oauth.authorize({
  authorizationUrl,
  clientId,
  scope,
  codeChallenge,
});
~~~

## Token lifecycle expectations

- generate a PKCE challenge and verifier
- exchange code for access token
- store token plus expiry metadata
- refresh when expired before reuse

## Sample files

- https://github.com/AdobeDocs/express-add-on-samples/blob/main/samples/import-images-using-oauth/src/utils/OAuthUtils.js
- https://github.com/AdobeDocs/express-add-on-samples/blob/main/samples/import-images-using-oauth/src/components/Connection.jsx
