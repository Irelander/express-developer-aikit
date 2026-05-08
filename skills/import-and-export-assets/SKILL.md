---
name: import-and-export-assets
title: "Import and Export Assets"
description: "Design import, drag-and-drop, rendition, and download flows that respect Adobe Express document permissions and runtime constraints."
stage: implementation
paths:
  - "**/src/**/*"
  - "**/manifest.json"
---

# Import and Export Assets

Design import, drag-and-drop, rendition, and download flows that respect Adobe Express document permissions and runtime constraints.

## When to use
- The task moves assets into or out of Adobe Express.
- The request mentions drag-and-drop, local files, cloud imports, downloads, or renditions.
- The add-on needs previews, exports, or asset ingestion from user-selected sources.

## What to inspect first
- Determine whether the flow is import, export, preview, or all three.
- Check whether the work belongs in the panel runtime, the document sandbox, or both.
- Verify manifest permissions such as allow-downloads or renditionPreview before designing UI around them.

## Decision guide
- For page or document export, use createRenditions from the panel runtime.
- For individual element snapshots, check whether experimental node renditions are the right tool.
- If the document may be under review, check exportAllowed before offering export or print flows and degrade to preview when needed.
- If assets come from OAuth-backed services, keep import flow and auth flow conceptually separate even when they work together.

## Workflow
1. Map the asset journey from source to final destination: upload, insert, preview, download, or external sync.
2. Choose the simplest Adobe Express API combination that fits the flow.
3. Check permissions and document constraints before exposing export or download controls.
4. Handle blobs, file types, and drag-and-drop callbacks explicitly rather than hiding them inside unrelated helpers.
5. Document what happens when export is restricted, the file type is unsupported, or the asset source becomes unavailable.

## Checks
- Do not skip exportAllowed for export or print intents.
- Do not forget allow-downloads when implementing downloads.
- Do not try to perform panel-side import or export UI actions from the document sandbox.

## Common pitfalls
- Offering download even when the document only supports preview.
- Forgetting the renditionPreview requirement for preview flows.
- Treating drag-and-drop, import, and export as one undifferentiated feature blob.

## Validation checklist
- Are the manifest permissions aligned with the planned import or export behavior?
- Is preview versus export behavior explicit when document restrictions apply?
- Are asset type, blob handling, and failure states covered?

## Source references
- Docs: create renditions guide
- Samples: export-sample, import-images-from-local, and Assets component

## Progressive references
- [Asset workflow guide](./references/asset-workflows.md) - Permissions, preview/export branching, and runtime ownership.
- [Code patterns](./references/code-patterns.md) - Minimal rendition and drag-drop patterns.
- [Import sample walkthrough](./references/import-sample-walkthrough.md) - Concrete asset import and drag-and-drop patterns from the Dropbox sample.
- [Export sample walkthrough](./references/export-sample-walkthrough.md) - Concrete rendition and preview behavior from the export sample.
- [Permission matrix](./references/permission-matrix.md) - Quick matrix for preview, export, download, and experimental rendition needs.

## Expected output
- asset flow plan
- permission requirements
- preview/export behavior
- failure-state notes
