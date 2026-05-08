# Import sample walkthrough

## Source

https://github.com/AdobeDocs/express-add-on-samples/blob/main/samples/import-images-using-oauth/src/components/Assets.jsx

## What the sample demonstrates

- folder discovery and asset listing separated from rendering
- loading state while remote assets are discovered
- click-to-add with app.document.addImage(blob)
- drag-to-document using enableDragToDocument
- preview callback that returns a URL
- completion callback that returns an array with a blob payload

## Good patterns to copy

- keep remote fetch and blob conversion in small helpers
- keep drag-and-drop setup attached to the rendered image element
- separate "discover assets" from "render assets" so loading and error handling stay clear
