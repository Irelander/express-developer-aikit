# Sample walkthrough

## OAuthUtils.js focus

Source: https://github.com/AdobeDocs/express-add-on-samples/blob/main/samples/import-images-using-oauth/src/utils/OAuthUtils.js

What it demonstrates:

- PKCE challenge and verifier generation kept in one helper module
- a single authorize entry point that wraps addOnUISdk.app.oauth.authorize
- a code-to-token exchange function that returns a normalized token shape
- a refresh function that takes the existing token and produces a fresh one
- token persistence helpers that read and write a single canonical key in panel storage

## What to copy from it

- keep all OAuth low-level work in one helper module, not scattered across components
- normalize token records before storing them: include access token, refresh token, and absolute expiry timestamp
- treat the helper as the only place that knows about provider-specific quirks

## Connection.jsx focus

Source: https://github.com/AdobeDocs/express-add-on-samples/blob/main/samples/import-images-using-oauth/src/components/Connection.jsx

What it demonstrates:

- a small panel component that owns connect and disconnect UI
- explicit connected, connecting, and disconnected visual states
- delegation of all real OAuth work to the OAuthUtils helper
- a clear failure path that surfaces an actionable message in the panel

## What to copy from it

- keep auth UI and token state visible at a high level so reviewers can see and exercise it
- make logout always reachable, not buried behind settings
- never let UI components call oauth.authorize directly; always go through the helper
