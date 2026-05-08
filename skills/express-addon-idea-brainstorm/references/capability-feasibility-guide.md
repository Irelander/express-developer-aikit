# Capability feasibility guide

Use this guide after the market scan and before recommending an MVP.

## Goal

Classify the idea against the real Adobe Express add-on runtime model so the recommendation reflects what the platform can actually support.

## Capability buckets

### 1. Panel-only workflow

Good fit when the value lives in UI, browsing, search, metadata entry, account state, or remote fetches.

Check against these shipped skills:

- `build-panel` for UI structure, theming, and visible loading/error states
- `connect-service` when third-party account access is part of the concept

Watch for:

- ideas that secretly need document editing even though they sound like simple UI
- concepts that assume background jobs or hidden long-running processes after the panel closes

### 2. Panel + document sandbox workflow

Required when the add-on creates, edits, inspects, or transforms document content.

Check against these shipped skills:

- `start-addon` for runtime split and manifest shape
- `edit-document` for editor API ownership and sandbox boundaries
- `connect-panel-to-document` for runtime communication and supported payload shapes

Watch for:

- ideas that try to do editor work directly from the panel
- ideas that depend on complex cross-runtime objects instead of plain serializable data

### 3. OAuth or connected-service workflow

Required when the add-on depends on Dropbox, Google Photos, OneDrive, or another protected external account.

Check against these shipped skills:

- `connect-service` for PKCE, token persistence, logout, and redirect URI requirements

Watch for:

- recommendations that treat login as a small detail instead of a scope multiplier
- ideas that become useless if reviewer credentials are unavailable

### 4. Import, preview, export, or download workflow

Required when the idea moves assets into or out of Adobe Express.

Check against these shipped skills:

- `import-and-export-assets` for blob handling, drag-and-drop, renditions, preview vs export, and permission requirements

Watch for:

- ideas that need `allow-downloads`, `renditionPreview`, or experimental APIs from day one
- concepts that assume export is always allowed regardless of document state

### 5. Publish-review-sensitive workflow

Use when the concept depends on browser-sensitive features, authentication, polished UX, or listing claims that are easy to over-promise.

Check against these shipped skills:

- `prepare-for-publish` for rejection patterns, cross-browser expectations, and reviewer-access concerns

Watch for:

- ideas that are only credible in one browser
- concepts whose listing promise would be broader than what the first build can reliably do

## Hard feasibility questions

- Does the idea need document editing, or can it stay panel-only?
- Does the value require browser APIs in the panel, or is someone implicitly assuming those APIs also exist in the sandbox?
- Does the idea require plain-data communication between runtimes?
- Does it depend on OAuth, downloads, export permissions, experimental APIs, or reviewer credentials?
- Does it assume background execution, unrestricted local file-system access, or undocumented Adobe Express behavior?

If the answer to the last question is yes, downgrade the recommendation immediately or cut the scope until it fits supported platform behavior.

## Recommendation pattern

When you present an idea recommendation, include:

- capability bucket: panel-only / panel+sandbox / OAuth / import-export / review-sensitive
- main Adobe Express fit: why the platform supports this idea
- main constraint: the biggest SDK or platform limit shaping scope
- first MVP cut: the smallest version that stays inside supported behavior

## Good output shape

- Market overlap: what already exists
- Capability fit: what Adobe Express can support cleanly
- Constraint note: what must be avoided or deferred
- MVP: the narrowest first release worth building
