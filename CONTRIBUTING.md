# Contributing

Issues and PRs welcome. The most useful ones tend to be:

- new skills, or improvements to existing ones (this is where most value lives)
- provider-installer fixes when something breaks in a specific environment
- feedback from real Adobe Express add-on projects — what's missing, what's wrong, what would actually help

## Getting set up

```bash
git clone https://github.com/irelander/express-developer-aikit.git
cd express-developer-aikit
npm run check
npm test
```

There's no build step. The CLI runs straight from `src/`.

## Project layout

```
bin/                     CLI entry point
skills/                  source of truth for every skill (real markdown files)
  <skill-name>/
    SKILL.md             main skill file with baseline frontmatter
    references/          progressive reference files
src/cli.js               command dispatcher
src/commands/            one file per subcommand (mcp init, skills install, ...)
src/data/skills.js       loader that reads skills/ at startup
src/lib/                 shared helpers (args, fs, frontmatter, output, providers)
tests/                   node:test suites — data validation + install integration
```

Skills live as real markdown files under `skills/`. The CLI loads them at startup, transforms the frontmatter per provider, and copies the directory tree into the right location (`.cursor/skills/`, `.claude/skills/`, etc.). You can also just download the `skills/` folder from GitHub and drop it into a provider's skill directory directly — npm is convenience, not a hard requirement.

## Adding or editing a skill

Add a directory under `skills/`:

```
skills/your-skill-name/
  SKILL.md
  references/
    something.md
    something-else.md
```

The `SKILL.md` frontmatter holds baseline metadata only:

```markdown
---
name: your-skill-name
title: "Human-Readable Title"
description: "One-sentence description of what this skill does."
stage: implementation
paths:
  - "**/src/**/*"
manualOnly: false
argumentHint: ""
---

# Human-Readable Title

Body of the skill in real markdown — sections like:

## When to use
- ...

## What to inspect first
- ...

## Workflow
1. ...

## Progressive references
- [Something](./references/something.md) - Short description.

## Expected output
- ...
```

Recognized frontmatter fields:

| Field | Required | Notes |
|---|---|---|
| `name` | yes | Must match the directory name |
| `description` | yes | One-sentence summary used in `skills list` |
| `title` | recommended | Human-readable; defaults to `name` |
| `stage` | recommended | `ideation`, `setup`, `implementation`, `release` |
| `paths` | optional | Glob patterns for providers that scope skills by path |
| `manualOnly` | optional | `true` to disable model-initiated invocation |
| `argumentHint` | optional | Hint string for slash-command-style invocation |

Reference files go under `references/`. Keep the main `SKILL.md` short and push longer material — sample walkthroughs, decision matrices, troubleshooting tables — into reference files so an agent loads them only when needed.

After editing, run `npm test`. The data tests automatically catch:

- duplicate skill names
- missing required frontmatter
- references linked from `SKILL.md` that don't exist on disk
- orphan reference files in `references/` that nothing links to

You don't need to write tests for the skill content itself.

## Before opening a PR

```bash
npm run check     # syntax check across all source files
npm test          # data tests + frontmatter parser tests + install integration
```

If your change adds new behavior to a command (not just skill content), add a test under `tests/`. Tests use `node:test`, which is built into Node 18+ — no extra dependencies.

## Style notes

- prefer editing existing files over creating new ones
- match existing code style: CommonJS, no build, no TypeScript
- skill content stays in English so it ships consistently across providers and clients
- keep reference markdown short and scannable — long prose belongs in the upstream Adobe Express docs the references point to

## Reporting issues

Useful issue reports include:

- Node version (`node --version`)
- the exact command you ran
- what you expected vs what actually happened

If it's a provider-specific bug, name the provider (cursor / claude-code / codex / vscode / antigravity) and ideally the workspace layout it occurred in.
