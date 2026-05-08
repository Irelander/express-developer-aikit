# MVP scope guide

## The one-trigger one-outcome rule

A first release should fit this sentence:

> When the user does X, the add-on produces Y, with one obvious success state.

If the answer needs more than one X or more than one Y, the scope is too wide.

## Cut these from MVP scope

- account systems unless the integration absolutely requires them
- multi-format export when one format demonstrates the value
- bulk operations when single-item operations prove the loop
- analytics dashboards or settings panels for a feature that has no settings yet
- onboarding tours for a single-screen workflow

## Keep these even in MVP scope

- empty, loading, and error states for the primary flow
- visible feedback when long operations are running
- a recoverable failure path when an external API or document state breaks

## How to recognize creep

- the description starts using "and" between value statements
- the feature list grows past five items before any code exists
- "we'll also need login" appears for features that worked fine without login

## Output shape

When recommending an MVP, return:

- one-sentence user problem
- one-sentence trigger
- one-sentence outcome
- one observable success metric
- one technical risk that could block the first release
