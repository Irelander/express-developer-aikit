---
name: express-addon-idea-brainstorm
title: "Adobe Express Add-on Idea Brainstorm"
description: "Evaluate a new Adobe Express add-on idea against marketplace overlap, platform constraints, and a realistic first MVP before implementation starts."
stage: ideation
argumentHint: "[idea, user problem, or category]"
manualOnly: true
---

# Adobe Express Add-on Idea Brainstorm

Evaluate a new Adobe Express add-on idea against marketplace overlap, platform constraints, and a realistic first MVP before implementation starts.

## When to use
- The user is still deciding what kind of add-on to build.
- You need to check whether the idea is already crowded in the Adobe Express ecosystem.
- A feature list exists, but it needs to be reduced into a first shippable MVP.

## What to inspect first
- Run the trending scan before making recommendations.
- Run a narrow snapshot search against the broader GitHub-hosted addon catalog before assuming whitespace.
- Use the shipped capability-focused skill references to confirm whether the idea fits current Adobe Express capabilities.
- Look for similar marketplace categories before praising originality.

## Decision guide
- If multiple similar add-ons already exist, move from 'build it' to 'how is this differentiated?'.
- If the core value depends on document manipulation, make sure the concept can be split between panel UI and document sandbox cleanly.
- If the idea needs OAuth, export, or premium workflows, call that out early because those features widen scope immediately.
- If the idea depends on browser APIs, background work, complex runtime messaging, or special manifest permissions, check feasibility before recommending it confidently.
- If the idea sounds broad, cut it to one user problem, one trigger, and one primary outcome.

## Workflow
1. Restate the proposal as a user problem instead of a feature label.
2. Run `addons scan --source trending` for current visible momentum, then run 1-3 narrow `addons scan --source snapshot --query ... --limit ...` lookups for broader overlap.
3. If one snapshot hit looks especially close, inspect that single record with `addons inspect --id ...` or `--name ...` instead of loading the whole list. Note the snapshot date/version in the CLI output.
4. Summarize the closest add-ons or adjacent categories from the scan results.
5. Classify the direction as Proceed, Differentiate, or Reconsider.
6. Run a capability feasibility pass: panel-only, panel + sandbox, OAuth/service, import/export, and review-risk requirements.
7. Recommend a smallest-possible MVP with one core loop and one obvious success metric.
8. Mention any Adobe Express constraints that could block or reshape the idea.

## Checks
- Do not praise an idea before checking overlap.
- Do not recommend features that depend on undocumented or unsupported Adobe Express APIs.
- Do not skip the capability feasibility pass when the idea depends on document editing, OAuth, asset flows, or runtime communication.
- Prefer a narrow, high-value workflow over a generic all-in-one add-on concept.

## Common pitfalls
- Treating a trend page scan as proof that no similar add-ons exist elsewhere.
- Pulling the full snapshot JSON into prompt context instead of slicing it with targeted search commands.
- Treating the GitHub-hosted snapshot as live truth. It is a dated catalog — use the date and addon count from the CLI output.
- Recommending an idea that assumes background jobs, direct file-system access, or sandbox-side browser APIs without checking whether the platform actually allows that.
- Recommending ideas that require document sandbox behavior but never acknowledging the UI/sandbox split.
- Turning an MVP into a roadmap dump with login, sync, export, analytics, and admin tooling all at once.

## Validation checklist
- Did you identify direct or adjacent overlap before recommending a path?
- Did you classify the idea against the right capability bucket before recommending scope?
- Did you reduce the solution to one clear first release?
- Did you mention the Adobe Express-specific technical constraints that matter for the idea?

## Source references
- Toolkit command: "addons scan --source trending"
- Toolkit command: "addons scan --source snapshot --query <term> --limit <n>"
- Toolkit command: "addons inspect --id <addOnId>" or "addons inspect --name <addon name>"
- Existing implementation skills for panel UI, document sandbox, OAuth, asset flows, and publish review
- Official Adobe Express trending add-ons page
- GitHub-hosted marketplace snapshot: dated public catalog (not a live feed), stamped with capture date, version, and addon count

## Progressive references
- [Market scan guide](./references/market-scan-guide.md) - How to use scans and local docs before recommending an idea.
- [Capability feasibility guide](./references/capability-feasibility-guide.md) - How to test an idea against the Adobe Express runtime model, SDK limits, and related implementation skills.
- [Differentiation playbook](./references/differentiation-playbook.md) - How to decide between Proceed, Differentiate, and Reconsider.
- [MVP scope guide](./references/mvp-scope-guide.md) - How to cut a broad idea down to one shippable first release.
- [Snapshot search recipes](./references/snapshot-search-recipes.md) - Query patterns for using the broader GitHub-hosted addon catalog without loading the full JSON.

## Expected output
- market read
- closest overlaps
- feasibility read
- recommended differentiation angle
- first MVP scope
- technical risk notes
