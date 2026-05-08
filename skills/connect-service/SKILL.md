---
name: connect-service
title: "Connect a Third-Party Service"
description: "Implement OAuth-based account connection in the panel runtime with PKCE, token persistence, and a complete login/logout flow."
stage: implementation
paths:
  - "**/manifest.json"
  - "**/src/**/*"
---

# Connect a Third-Party Service

Implement OAuth-based account connection in the panel runtime with PKCE, token persistence, and a complete login/logout flow.

## When to use
- The add-on connects to Dropbox, Google Photos, OneDrive, or another external account.
- The task mentions login, tokens, refresh flow, or importing user assets from a third-party service.
- Authentication is required before the main add-on workflow becomes useful.

## What to inspect first
- Check manifest OAuth permissions and the provider hostnames first.
- Find where the repo stores or refreshes tokens before adding another auth layer.
- Confirm whether both legacy and current Express redirect URIs are accounted for in provider setup.

## Decision guide
- If the integration is OAuth 2.0 with code exchange, use PKCE instead of ad hoc token handling.
- If tokens must survive sessions, decide upfront whether storage is local or remote and how expiry is checked.
- If the add-on offers paid or privileged features, make login and logout equally complete and testable.

## Workflow
1. Map the provider setup: authorization URL, token URL, client ID, scopes, and redirect URIs.
2. Add provider hostnames to permissions.oauth in the manifest before wiring the panel UI.
3. Use the panel runtime OAuth authorize flow, then exchange the returned code for tokens using a PKCE verifier.
4. Persist tokens with expiry metadata and implement refresh logic before using the access token in normal flows.
5. Provide both login and logout UI, and make failure states explicit.

## Checks
- Do not place OAuth flows in the document sandbox.
- Do not forget logout support or token persistence.
- Do not ship provider setup using only one redirect URI when both legacy and current Express hosts may matter.

## Common pitfalls
- Missing manifest OAuth hostnames.
- Failing to refresh expired tokens and then debugging random 401s later.
- Implementing login but forgetting logout or reviewer test credentials.

## Validation checklist
- Are manifest OAuth hostnames correct?
- Does the flow use PKCE and store expiry-aware token state?
- Can a reviewer log in, use the feature, and log out cleanly?

## Source references
- Docs: OAuth 2.0 guide
- Samples: OAuthUtils, Connection component, and Google Photos sample

## Progressive references
- [OAuth setup](./references/oauth-setup.md) - Redirect URIs, manifest permissions, and lifecycle rules.
- [Code patterns](./references/code-patterns.md) - PKCE and token lifecycle patterns from the official samples.
- [Sample walkthrough](./references/sample-walkthrough.md) - How OAuthUtils and Connection collaborate in the official OAuth sample.
- [Token lifecycle](./references/token-lifecycle.md) - Concrete rules for storing, refreshing, and revoking OAuth tokens.
- [Troubleshooting](./references/troubleshooting.md) - Quick matrix for common OAuth failure modes.

## Expected output
- OAuth flow plan
- manifest updates
- token persistence approach
- login/logout checklist
