---
name: build-panel
title: "Build Panel UI"
description: "Build or review Adobe Express panel UI with recommended Spectrum-based patterns, Express theming, and practical UI quality checks."
stage: implementation
paths:
  - "**/*.tsx"
  - "**/*.ts"
  - "**/*.jsx"
  - "**/*.css.ts"
  - "**/*.css"
---

# Build Panel UI

Build or review Adobe Express panel UI with recommended Spectrum-based patterns, Express theming, and practical UI quality checks.

## When to use
- The task is changing the add-on panel UI.
- You need to choose or review Spectrum Web Components, swc-react, or Express theming setup.
- The issue involves layout, theme imports, component consistency, or UI feedback states.

## What to inspect first
- Identify whether the repo uses vanilla SWC, swc-react, or another UI stack before changing code.
- Check whether the Express theme imports are already present.
- Read the current layout and state patterns before introducing new component structure.

## Decision guide
- Prefer Spectrum Web Components as the default guidance and prefer swc-react over React Spectrum when the repo is React-based.
- If the repo already uses React Spectrum, improve within that system rather than mixing libraries casually.
- If the UI change needs loading, empty, or error states, design those states explicitly instead of bolting them on later.

## Workflow
1. Confirm the active UI stack and theme setup before editing components.
2. Wrap or verify panel content under the appropriate Express theme container.
3. Use the repo's existing component and state patterns unless there is a clear reason to change them.
4. Add visible feedback for loading, disabled, empty, and error states where the flow needs it.
5. Check that navigation, labels, and visible text remain understandable and localizable.

## Checks
- Do not mix unrelated Spectrum approaches without a reason.
- Do not forget Express theme imports if the goal is an Adobe Express-native look.
- Do not hide failures or long-running work without feedback in the panel.

## Common pitfalls
- Using React Spectrum in new work when the repo already favors SWC or swc-react patterns.
- Forgetting typography or theme imports and ending up with an inconsistent look.
- Building a panel state machine with no loading, empty, or validation feedback.

## Validation checklist
- Does the UI follow the repo's chosen Spectrum implementation?
- Is Express theming applied correctly?
- Are empty, loading, and error states visible and actionable?

## Source references
- Docs: implementation guide and UI guidelines
- Samples: dialog-add-on and import-images-using-oauth components

## Progressive references
- [UI stack guide](./references/ui-stack-guide.md) - When to use SWC, swc-react, and Express theming.
- [Code patterns](./references/code-patterns.md) - Theme imports and panel-state expectations.
- [Sample walkthrough](./references/sample-walkthrough.md) - What the dialog and OAuth samples demonstrate about panel UI structure.
- [State design](./references/state-design.md) - How to design loading, empty, error, and disabled states up front.

## Expected output
- UI stack read
- theme guidance
- state-feedback checklist
- component change plan
