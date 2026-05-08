# Sample walkthrough

## dialog-add-on sample

Source: https://github.com/AdobeDocs/express-add-on-samples/tree/main/samples/dialog-add-on

What it demonstrates:

- a small panel surface with a few clear primary actions
- explicit dialog invocation through the add-on UI SDK rather than ad hoc DOM modals
- visible button states tied to whether the dialog is busy or idle
- separation between user-triggered actions and the underlying SDK call

## What to copy from it

- prefer SDK-provided dialog primitives instead of custom modal markup
- keep button labels and primary actions short and action-oriented
- show feedback during dialog work even if the dialog is short-lived

## import-images-using-oauth components

Source: https://github.com/AdobeDocs/express-add-on-samples/tree/main/samples/import-images-using-oauth/src/components

What it demonstrates:

- panel decomposition into small components: Connection, Assets, App shell
- one component per concern (auth status vs. asset listing vs. app frame)
- swc-react components used consistently rather than mixing libraries
- conditional rendering driven by clear top-level state

## What to copy from it

- split panels into "auth gate", "primary work area", and "global frame"
- keep state at the highest component that actually needs it, not lower
- use swc-react components for buttons, fields, and feedback rather than raw HTML
