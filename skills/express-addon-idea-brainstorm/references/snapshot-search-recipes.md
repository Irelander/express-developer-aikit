# Snapshot search recipes

Use the GitHub-hosted marketplace snapshot as a **retrieval tool**, not as prompt baggage.

## Retrieval rules

- Never paste the full snapshot JSON into context.
- Prefer 1-3 narrow searches with `--limit 5` to `--limit 10`.
- Search adjacent wording, not just the original phrase.
- Inspect a single addon record when one result looks close.
- Remember: the snapshot is a dated public marketplace catalog on GitHub. It is broader than trending but not a live feed.
- Keep the snapshot date/version from the CLI output in your notes when market timing matters.

## Recipe 1 — direct use-case overlap

```bash
express-developer-aikit addons scan --source snapshot --query "qr code" --limit 5
```

Use when the idea already has a clear user-facing label.

## Recipe 2 — adjacent task wording

```bash
express-developer-aikit addons scan --source snapshot --query "contrast" --limit 5
express-developer-aikit addons scan --source snapshot --query "wcag" --limit 5
express-developer-aikit addons scan --source snapshot --query "accessibility" --limit 5
```

Use when the market might describe the same job with different wording.

## Recipe 3 — localized or discoverability angle

```bash
express-developer-aikit addons scan --source snapshot --query "korean" --limit 5
express-developer-aikit addons scan --source snapshot --query "japanese" --limit 5
express-developer-aikit addons scan --source snapshot --query "discovery" --limit 5
```

Use when the idea is about findability, region, language, or audience segment.

## Recipe 4 — inspect the closest hit only

```bash
express-developer-aikit addons inspect --id <addOnId>
express-developer-aikit addons inspect --name "Exact Add-on Name"
```

Use when a shortlist already exists and you need description-level detail without loading more rows.

## Recipe 5 — compact JSON for comparison tables

```bash
express-developer-aikit addons scan --source snapshot --query "background" --limit 5 --json
```

Use when you need a small structured slice for side-by-side comparison.
