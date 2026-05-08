# Asset workflow guide

## Export rules

- use createRenditions from the panel runtime
- check exportAllowed before export or print intents
- use preview intent when export is restricted
- add allow-downloads for download flows

## Import rules

- local files and OAuth asset fetching belong in the panel runtime
- use drag-and-drop helpers deliberately; keep completion callbacks small
- convert fetched assets to Blob before insertion when needed

## Read these sources

- https://github.com/AdobeDocs/express-add-ons-docs/blob/main/src/pages/guides/learn/how-to/create-renditions.md
- https://github.com/AdobeDocs/express-add-on-samples/tree/main/samples/export-sample
- https://github.com/AdobeDocs/express-add-on-samples/tree/main/samples/import-images-from-local
