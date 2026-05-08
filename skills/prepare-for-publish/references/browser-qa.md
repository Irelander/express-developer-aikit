# Browser QA

## Required browsers

- Chrome
- Safari
- Edge
- Firefox

## Coverage rule

Every primary user-visible flow must be exercised in each browser at least once before submission. "Works in Chrome" is not coverage.

## Browser-sensitive features

Pay extra attention when the add-on uses:

- clipboard or paste interactions
- file input, drag-and-drop, or download triggers
- camera, microphone, or other permission-prompted APIs
- video or canvas-heavy rendering
- popup-based OAuth or third-party redirects

## Practical pass

- open the add-on in a fresh window
- run the primary flow start to finish
- confirm states: idle, loading, success, empty, error
- confirm logout where applicable
- close and reopen to confirm persistence behaves consistently

## When something fails in one browser

- decide whether to fix, gate, or document
- if fixing, prefer addressing the root cause over hiding the feature
- if gating or documenting, be explicit in release notes and listing copy
