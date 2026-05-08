# Sample walkthrough

## get-started sample

Source: https://github.com/AdobeDocs/express-add-on-samples/tree/main/samples/get-started

What it demonstrates:

- the smallest viable add-on layout: index.html, src entry, manifest.json
- a single panel surface with one or two primary actions
- direct addOnUISdk usage without extra abstractions
- manifest paths that match the no-build template style by default

## What to copy from it

- start with the smallest possible folder structure and grow only when needed
- keep the panel entry point obvious — one HTML file, one JS entry
- defer build tooling until the project actually has more than one source file worth bundling

## Document-sandbox-capable starter

Source: https://github.com/AdobeDocs/express-add-on-samples/tree/main/document-sandbox-samples/communication-iframe-documentSandbox

What it demonstrates:

- a clean two-runtime split from day one
- explicit sandbox entry path declared in the manifest
- minimal panel and sandbox files that already follow the runtime ownership rules

## What to copy from it

- if document editing is in scope from day one, start from a sandbox-capable template — do not bolt sandbox on later
- mirror its runtime ownership boundaries: panel owns UI and fetch, sandbox owns editor mutations
