# OAuth troubleshooting

## redirect_uri_mismatch

- cause: provider only allows one of the two Express redirect URIs
- fix: register both legacy and current Express URIs in the provider console
- verify: try the auth flow on both express.adobe.com and new.express.adobe.com

## origin or hostname blocked

- cause: provider hostname is missing from manifest permissions.oauth
- fix: add the hostname and reload the add-on
- verify: confirm the network call actually reaches the provider domain after reload

## random 401 errors after working sessions

- cause: token expired and was reused without refresh
- fix: implement refresh logic and check expiresAt before every authenticated request
- verify: simulate expiry by setting a near-past expiresAt and confirm the next call refreshes cleanly

## logout works but next login behaves oddly

- cause: token record was partially cleared
- fix: clear the entire normalized token record on logout, including expiresAt and refreshToken
- verify: after logout, panel state truly returns to the disconnected branch

## reviewer cannot test the integration

- cause: protected workflows require credentials reviewers do not have
- fix: provide reviewer credentials and document them in submission notes
- verify: walk through the full connect, use, and disconnect flow with the supplied credentials
