# Bridge patterns

## Required shape

- panel waits for SDK readiness
- panel gets a proxy to the document sandbox
- sandbox exposes a small API surface
- sandbox may also proxy back to the panel when UI state is needed

## Supported data only

Use primitives, plain objects, arrays, Blob, ArrayBuffer, and Error. Avoid functions, Maps, Sets, Dates, RegExp, symbols, custom class instances, and circular objects.

## Read these files

- https://github.com/AdobeDocs/express-add-ons-docs/blob/main/src/pages/references/document-sandbox/communication/index.md
- https://github.com/AdobeDocs/express-add-on-samples/tree/main/document-sandbox-samples/communication-iframe-documentSandbox
- https://github.com/AdobeDocs/express-add-on-samples/blob/main/document-sandbox-samples/express-stats-addon/src/ui/index.js
