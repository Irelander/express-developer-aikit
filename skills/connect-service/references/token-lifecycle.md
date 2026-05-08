# Token lifecycle

## Token record shape

Recommended fields stored together:

- accessToken
- refreshToken
- expiresAt as an absolute timestamp in milliseconds
- providerId so a single helper can support multiple integrations

## Storage

- prefer addOnUISdk.instance.clientStorage for cross-session persistence in the panel runtime
- use a single key per provider, not many small keys
- never store tokens in the document sandbox or in document content

## Refresh policy

- check expiresAt before each authenticated call
- treat tokens within a short safety window of expiry as expired
- if refresh fails, clear the token record and force the user back to the connect state

## Logout policy

- clear the token record on explicit logout
- if the provider supports a revoke endpoint, call it on logout
- update UI immediately so the connect state is reachable again
