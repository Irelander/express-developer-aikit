---
name: start-addon
title: "Start an Adobe Express Add-on"
description: "Choose the right project template, manifest shape, and runtime layout before code starts drifting in the wrong direction."
stage: setup
---

# Start an Adobe Express Add-on

Choose the right project template, manifest shape, and runtime layout before code starts drifting in the wrong direction.

## When to use
- A new Adobe Express add-on project is being created.
- An existing repo needs a quick structural audit before feature work continues.
- The user is unsure which template, framework, or manifest shape fits the feature.

## What to inspect first
- Read package.json, manifest.json, and the project folder layout before suggesting changes.
- Determine whether the add-on is UI-only or needs document manipulation.
- Check whether the repo is a build template or a no-build template because manifest paths differ.

## Decision guide
- If the add-on only needs panel UI, start with a UI-only template and avoid introducing document sandbox.
- If the add-on creates or edits document content, use a document-sandbox-capable template from the start.
- If the UI is simple, prefer vanilla JS or SWC patterns; if the UI is complex and state-heavy, React is reasonable.
- Do not add build tooling or TypeScript just because it feels modern; choose it when the repo or team actually benefits from it.

## Workflow
1. Identify the current template family and whether the repo uses build output or direct source files.
2. Verify that manifest paths match the template style.
3. Confirm that all UI code and CSS live in the iframe runtime and all document changes live in the document sandbox.
4. List the smallest structural fixes needed before feature work continues.
5. Recommend a short next-step plan rather than rewriting the whole repo at once.

## Checks
- Do not assume React or SWC unless the repo actually shows it.
- Do not tell developers to place CSS or DOM logic in the document sandbox.
- Do not forget that manifest changes usually require a refresh or reload cycle.

## Common pitfalls
- Confusing build-template manifest paths with no-build template paths.
- Adding document sandbox late without also adding runtime communication patterns.
- Trying to share runtime-specific code directly between iframe and sandbox.

## Validation checklist
- Does the chosen template match whether document manipulation is required?
- Do manifest paths match the repo's build style?
- Are UI concerns and sandbox concerns clearly separated in the folder structure?

## Source references
- Docs: project anatomy guide
- Docs: manifest reference
- Sample: get-started sample

## Progressive references
- [Template guide](./references/template-guide.md) - Template choice, runtime split, and manifest path rules.
- [Sample walkthrough](./references/sample-walkthrough.md) - What the get-started sample reveals about minimal project shape.
- [Manifest checklist](./references/manifest-checklist.md) - What to verify in manifest.json before feature work begins.

## Expected output
- template recommendation
- structural audit
- manifest guidance
- next setup steps
