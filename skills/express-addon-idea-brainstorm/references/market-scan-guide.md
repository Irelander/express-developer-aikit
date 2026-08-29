# Market scan guide

## Primary workflow

1. Run the trending add-on scan.
2. Run 1-3 narrow snapshot searches against the broader GitHub-hosted addon catalog.
3. Group results by use case, not by superficial keyword.
4. Compare the proposal against those categories.
5. Inspect one or two closest snapshot hits if the overlap looks serious.
6. Run a capability feasibility pass against the Adobe Express runtime model and existing implementation skills.
7. Cut the idea to one narrow MVP.

## What to look for

- repeated categories such as storage connectors, QR utilities, or import tools
- repeated naming and keyword clusters from the snapshot search, not just the trending list
- ideas that need document sandbox work versus panel-only work
- features that require OAuth, renditions, or marketplace-ready metadata from day one
- features that assume unsupported background work, direct local file access, or browser APIs inside the document sandbox

## Snapshot notes

- The broader marketplace snapshot is a dated public catalog on GitHub, not a live feed. Use it as a strong overlap signal and record the snapshot date/count from the CLI output.
- Prefer several small searches (`--query accessibility`, `--query contrast`, `--query wcag`) over one broad dump.
- If one result seems highly relevant, inspect only that record instead of requesting more rows.

## Public sources to consult

- https://github.com/AdobeDocs/express-add-ons-docs/blob/main/src/pages/guides/getting-started/addon-project-anatomy.md
- https://github.com/AdobeDocs/express-add-ons-docs/blob/main/src/pages/guides/learn/platform-concepts/architecture.md
- https://github.com/AdobeDocs/express-add-ons-docs/blob/main/src/pages/guides/learn/how-to/oauth2.md
- https://github.com/AdobeDocs/express-add-on-samples/tree/main/marketplace

## Capability references to consult

- `../start-addon/` mindset: template choice, runtime split, and manifest implications
- `../build-panel/` mindset: what panel UI can realistically do well
- `../edit-document/` mindset: what requires document sandbox and editor APIs
- `../connect-panel-to-document/` mindset: what must cross the runtime bridge, and what data types are safe
- `../connect-service/` mindset: what OAuth and third-party account flows add to scope
- `../import-and-export-assets/` mindset: what import, preview, export, download, and rendition flows require
- `../prepare-for-publish/` mindset: what review-time browser, auth, and UX risks should shape the first MVP

## Feasibility questions

- Is this panel-only, or does it require document sandbox work?
- Does the core value depend on runtime communication that must stay plain-data only?
- Does the idea need OAuth, special manifest permissions, or reviewer credentials?
- Does it rely on preview/export/download behavior that brings `renditionPreview`, `allow-downloads`, or `exportAllowed()` into scope?
- Does it assume background execution, unrestricted file-system access, or sandbox-side browser APIs that Adobe Express add-ons do not support?

## Search starter commands

```bash
express-developer-aikit addons scan --source trending --limit 10
express-developer-aikit addons scan --source snapshot --query accessibility --limit 8
express-developer-aikit addons scan --source snapshot --query contrast --limit 8
express-developer-aikit addons inspect --id wlgg52gjj
```

## Recommendation format

- Proceed: overlap is low or your angle is clearly stronger
- Differentiate: overlap is medium or high, but a clear niche exists
- Reconsider: saturated space, vague user value, or weak Adobe Express fit
