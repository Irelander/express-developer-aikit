# OAuth setup

## Required provider setup

- allow both redirect URIs:
  - https://new.express.adobe.com/static/oauth-redirect.html
  - https://express.adobe.com/static/oauth-redirect.html
- add provider hostnames to permissions.oauth

## Review-critical rules

- login and logout must both exist
- tokens should persist across sessions
- reviewers may need working credentials for protected flows

## Read first

- https://github.com/AdobeDocs/express-add-ons-docs/blob/main/src/pages/guides/learn/how-to/oauth2.md
- https://github.com/AdobeDocs/express-add-on-samples/blob/main/samples/import-images-using-oauth/README.md
