---
name: edit-document
title: "Edit Document Content"
description: "Plan and implement document-editing features in the document sandbox using the right Adobe Express editor APIs and runtime boundaries."
stage: implementation
paths:
  - "**/sandbox/**/*"
  - "**/src/sandbox/**/*"
  - "**/manifest.json"
---

# Edit Document Content

Plan and implement document-editing features in the document sandbox using the right Adobe Express editor APIs and runtime boundaries.

## When to use
- The task creates, edits, inspects, or exports document content.
- The request mentions text, shapes, pages, metadata, selection, or element-level changes.
- You need to map a user action to actual editor operations.

## What to inspect first
- Confirm that the logic belongs in the document sandbox rather than the iframe runtime.
- Find the insertion parent, selection context, or existing editor helpers before writing new code.
- Look for a similar official sample before inventing a new editor pattern.

## Decision guide
- If the feature needs DOM, fetch, or browser-only APIs, keep that in the panel and send only the necessary data to the sandbox.
- If the feature only needs document changes, keep the operation narrow and expose one sandbox method for it.
- If the request mentions element snapshots or thumbnails, check whether page or document renditions or experimental node renditions are the better fit.

## Workflow
1. Translate the user request into explicit document operations such as create, inspect, move, style, or export.
2. Choose the sandbox entry point and define the minimum data that should cross the runtime boundary.
3. List the exact editor APIs that should be used before drafting code.
4. Handle edge cases such as empty selection, wrong node type, or unsupported document state.
5. Return the final plan in terms of runtime boundary, editor calls, and user-visible behavior.

## Checks
- Do not place DOM APIs, browser storage, or fetch logic in the document sandbox.
- Do not assume all editor operations are available from the panel runtime.
- Do not skip edge cases around selection or insertion location.

## Common pitfalls
- Calling editor APIs from the iframe runtime.
- Creating nodes without inserting or positioning them correctly.
- Forgetting that sandbox debugging is mostly console-based because it runs separately from the panel.

## Validation checklist
- Is the feature implemented in the correct runtime?
- Are selection, insertion parent, or target-node assumptions validated?
- Are unsupported or experimental APIs called out explicitly?

## Source references
- Docs: architecture guide
- Docs: communication APIs reference
- Samples: editor-apis and express-stats-addon

## Progressive references
- [Docs and samples](./references/docs-and-samples.md) - Where to look for runtime rules and editor API examples.
- [Code patterns](./references/code-patterns.md) - Minimal document-sandbox patterns to reuse before writing new code.
- [Sample walkthrough](./references/sample-walkthrough.md) - What the official document sandbox samples are doing and why.

## Expected output
- runtime boundary
- editor API plan
- edge-case notes
- relevant sample pointers
