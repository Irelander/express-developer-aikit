# Asset code patterns

## Rendition creation

~~~js
const rendition = await addOnUISdk.app.document.createRenditions(
  { range: addOnUISdk.constants.Range.currentPage, format: addOnUISdk.constants.RenditionFormat.png },
  addOnUISdk.constants.RenditionIntent.export,
);
~~~

## Permission branch

Check exportAllowed before export or print. Fall back to preview if needed.

## Drag and drop

Keep preview and completion callbacks focused on producing document-ready blobs or URLs.
