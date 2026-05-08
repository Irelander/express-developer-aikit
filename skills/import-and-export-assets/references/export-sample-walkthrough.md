# Export sample walkthrough

## Source

https://github.com/AdobeDocs/express-add-on-samples/blob/main/samples/export-sample/src/exportUtils.js

## What the sample demonstrates

- switching UI controls based on selected output type
- delaying the final download action until preview is ready
- rendering preview images or videos from rendition blobs
- zipping multiple non-PDF outputs when needed

## Good patterns to copy

- treat preview and download as separate states
- make format-specific controls visible only when relevant
- create object URLs from rendition blobs close to where they are rendered or downloaded
- keep export option changes explicit so the user sees that preview must be regenerated
