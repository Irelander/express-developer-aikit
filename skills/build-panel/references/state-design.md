# State design

## States to plan for every panel surface

- idle: nothing happening, primary action is available
- loading: a request, rendition, or sandbox call is in flight
- empty: a list or area has no items to show yet
- error: an operation failed and the user needs context plus a next action
- disabled: a feature is gated by permission, document type, or login state

## How to choose between disabled and hidden

- hide a feature when it is irrelevant to this document or this user
- disable a feature when it is normally relevant but currently blocked, and explain why on hover or near the control

## Feedback rules

- long-running work needs visible progress or at least a busy indicator
- destructive actions need confirmation and a clear undo or reversal path when possible
- error messages should describe what failed and what the user can do next, not just throw a stack trace into the panel

## Light validation pattern

- validate input before triggering sandbox or network calls
- block the primary action and explain the validation failure inline
- do not rely solely on disabled buttons; users expect a visible reason
