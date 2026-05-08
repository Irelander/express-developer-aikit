# Submission flow

## 1. Functional gate

Before anything else, confirm:

- core flows work end to end on all four supported browsers
- login and logout are both implemented
- failures are visible, not silent

If any of these are missing, treat them as launch blockers.

## 2. Compatibility and permissions gate

- manifest permissions match actual behavior
- OAuth hostnames are present if needed
- document-restricted flows respect exportAllowed and degrade to preview

## 3. Listing gate

- description, release notes, and screenshots match the current build
- testing information includes any reviewer credentials
- no "plugin" wording remains

## 4. Polish

- empty, loading, and error states feel intentional
- copy is clear and consistent
- icons and images load correctly

## 5. Submission

- bundle the build
- attach assets
- submit with testing instructions

## How to report readiness

When summarizing publish readiness:

- list blockers first, then warnings, then optional improvements
- be explicit about which gate each item belongs to
- avoid ending on a marketing tone; the reviewer cares about correctness
