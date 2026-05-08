# Rejection patterns

## Functionality

- core feature does not work in one of the four supported browsers
- a primary action is silent on failure with no feedback
- import or export breaks on file types the description claims to support

How to pre-empt:

- exercise the primary action end to end in Chrome, Safari, Edge, and Firefox
- confirm error states are visible and actionable
- match listing copy to what actually works in the build

## Authentication

- login works but logout is missing or hidden
- protected features require credentials reviewers do not have
- token expiry produces broken UI rather than a clean re-login flow

How to pre-empt:

- always pair login with a discoverable logout
- ship reviewer credentials when submission requires authenticated workflows
- verify expired-token paths return the panel to the connect state cleanly

## UX and UI

- broken icons, missing images, or unstyled controls
- unclear navigation, especially after success or error
- references to "plugin" instead of "add-on" in product surfaces or listing text

How to pre-empt:

- do a final pass with a fresh install and click every primary surface
- replace any "plugin" wording across UI, docs, and marketing copy
- make sure error and empty states have at least one obvious next action

## Listing and metadata

- short or empty release notes
- screenshots that do not match the current build
- missing testing information for review

How to pre-empt:

- write release notes from the user's point of view, not the changelog's
- regenerate screenshots whenever the panel UI changes meaningfully
- include explicit testing steps that mirror real user flows
