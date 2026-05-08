# Template guide

## Start with the template decision

- UI-only add-on: basic JavaScript template
- document editing plus simple UI: JavaScript with document sandbox
- complex UI: React variant
- stronger type safety: TypeScript variant

## Runtime split rules

- UI code lives in the iframe runtime
- CSS lives in the iframe runtime
- document manipulation lives in the document sandbox
- fetch, DOM, and browser APIs do not belong in the sandbox

## Build vs no-build manifest paths

- no-build document sandbox path: sandbox/code.js
- build template document sandbox path: code.js

## Read these first

- https://github.com/AdobeDocs/express-add-ons-docs/blob/main/src/pages/guides/getting-started/addon-project-anatomy.md
- https://github.com/AdobeDocs/express-add-ons-docs/blob/main/src/pages/references/manifest/index.md
- https://github.com/AdobeDocs/express-add-on-samples/tree/main/samples/get-started
