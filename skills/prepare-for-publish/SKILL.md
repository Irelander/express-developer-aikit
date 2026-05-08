---
name: prepare-for-publish
title: "Prepare an Add-on for Publish Review"
description: "Review functionality, metadata, browser coverage, authentication, and submission details so the add-on is ready for Adobe review."
stage: release
argumentHint: "[release, review, or submission context]"
manualOnly: true
---

# Prepare an Add-on for Publish Review

Review functionality, metadata, browser coverage, authentication, and submission details so the add-on is ready for Adobe review.

## When to use
- The add-on is approaching submission.
- The user wants a release-readiness or marketplace-readiness review.
- You need to turn scattered launch work into a clear pre-submission checklist.

## What to inspect first
- Read the listing metadata, manifest, release notes, and help or support links if they exist.
- Check whether the add-on requires authentication, premium credentials, or third-party service setup for review.
- Review obvious UX, navigation, feedback, and browser-compatibility risks before discussing packaging.

## Decision guide
- If the add-on uses login, review the auth flow as a first-class launch blocker, not a side detail.
- If the add-on has multiple browser-sensitive features, treat cross-browser QA as required work rather than a nice-to-have.
- If submission details are missing, separate listing-completeness issues from product-quality issues so the team can fix them in order.

## Workflow
1. Check core functionality end to end, including edge cases and error handling, before reviewing polish.
2. Verify navigation, progress feedback, validation, and obvious broken links or assets.
3. Review authentication, logout support, and reviewer access requirements if the add-on uses accounts or paid features.
4. Check listing metadata, release notes, required files, and submission information for completeness.
5. Return a short publish-readiness summary with blocking issues first and optional improvements second.

## Checks
- Do not call a release ready based only on metadata or a happy-path demo.
- Do not forget the four officially supported browsers: Chrome, Safari, Edge, and Firefox.
- Do not describe the product as a plugin anywhere in submission-facing material.

## Common pitfalls
- Broken core features that only fail under specific review conditions.
- Authentication flows with no logout option or no reviewer credentials.
- Silent errors, weak validation, or no progress feedback for background operations.

## Validation checklist
- Have the core flows been tested across Chrome, Safari, Edge, and Firefox?
- Are release notes, testing information, assets, and listing details complete?
- Does the add-on avoid common review rejections in functionality, auth, and UX?

## Source references
- Docs: listing guide, submission checklist, and common rejections guide

## Progressive references
- [Review checklist](./references/review-checklist.md) - Submission, QA, and rejection-prevention references.
- [Rejection patterns](./references/rejection-patterns.md) - Common reasons add-ons get rejected and how to pre-empt each one.
- [Browser QA](./references/browser-qa.md) - How to actually exercise an add-on across the four supported browsers.
- [Listing metadata](./references/listing-metadata.md) - What submission metadata reviewers actually expect to see.
- [Submission flow](./references/submission-flow.md) - Sequence the launch work so blockers come before polish.

## Expected output
- publish-readiness summary
- blocking review risks
- submission checklist
- recommended next fixes
