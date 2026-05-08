# Permission matrix

## Preview flow

- intent: preview
- requirement: renditionPreview in manifest requirements
- exportAllowed check: not required

## Export or print flow

- intent: export or print
- requirement: allow-downloads when files are downloaded
- exportAllowed check: required before offering export or print

## Element rendition flow

- API: VisualNode.createRendition
- note: experimental API
- extra requirement: experimentalApis when the chosen API needs it

## PPTX flow

- check document type before offering PPTX
- only show it for presentation documents
