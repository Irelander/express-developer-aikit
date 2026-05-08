---
name: connect-panel-to-document
title: "Connect Panel UI to Document Logic"
description: "Design a clean bridge between panel UI and document sandbox using runtime.exposeApi and runtime.apiProxy."
stage: implementation
paths:
  - "**/src/ui/**/*"
  - "**/src/sandbox/**/*"
  - "**/sandbox/**/*"
---

# Connect Panel UI to Document Logic

Design a clean bridge between panel UI and document sandbox using runtime.exposeApi and runtime.apiProxy.

## When to use
- The add-on has both UI code and document-editing code.
- User actions in the panel need to trigger sandbox operations.
- The current repo already has runtime communication but it is getting messy.

## What to inspect first
- Read the existing panel and sandbox entry points before adding new bridge methods.
- Check whether the payloads crossing the bridge are serializable plain data.
- Find whether one side is already exposing a runtime API you can extend rather than duplicating it.

## Decision guide
- If the panel gathers input and the sandbox mutates the document, keep the bridge method narrow and explicit.
- If the sandbox needs UI state or user choices, expose a small UI API instead of reaching for global state tricks.
- If payloads look complex, simplify them before crossing the boundary because unsupported data types will fail.

## Workflow
1. Define the contract first: method name, inputs, outputs, and which runtime owns the work.
2. Expose the API from the owning runtime.
3. Call it from the other runtime via an API proxy only after the SDK is ready.
4. Keep return values simple and make failures visible rather than swallowing them.
5. Document the bridge surface so future features extend the same contract instead of inventing a second one.

## Checks
- Do not call cross-runtime methods before the SDK ready state resolves.
- Do not pass unsupported data types such as functions, Maps, Sets, or circular objects across the boundary.
- Do not bury business logic in anonymous bridge callbacks with no clear ownership.

## Common pitfalls
- Forgetting to await the API proxy before using it.
- Passing browser-only objects or class instances across the communication layer.
- Letting UI concerns leak into sandbox methods or vice versa.

## Validation checklist
- Is each bridge method owned by the correct runtime?
- Are payloads and return values limited to supported data types?
- Does the panel wait for SDK readiness before using runtime APIs?

## Source references
- Docs: communication APIs reference
- Docs: architecture guide
- Samples: communication-iframe-documentSandbox and express-stats-addon

## Progressive references
- [Bridge patterns](./references/bridge-patterns.md) - Runtime communication rules and sample ownership patterns.
- [Code patterns](./references/code-patterns.md) - Minimal cross-runtime proxy examples.
- [Sample walkthrough](./references/sample-walkthrough.md) - Real panel and sandbox collaboration from the official stats sample.
- [Supported data types](./references/data-types.md) - Quick reminder for what can safely cross the runtime boundary.

## Expected output
- bridge contract
- method ownership
- payload rules
- failure-handling notes
