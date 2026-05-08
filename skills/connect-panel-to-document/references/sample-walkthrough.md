# Sample walkthrough

## Panel side reference

Source: https://github.com/AdobeDocs/express-add-on-samples/blob/main/document-sandbox-samples/express-stats-addon/src/ui/index.js

Notice these steps in order:

1. wait for addOnUISdk.ready
2. define a panel API for sandbox callbacks such as status updates or UI rendering helpers
3. get a proxy to documentSandbox
4. expose the panel API
5. wire user events to sandbox proxy calls

## Sandbox side reference

Source: https://github.com/AdobeDocs/express-add-on-samples/blob/main/document-sandbox-samples/express-stats-addon/src/documentSandbox/code.js

Notice these steps in order:

1. get a proxy back to the panel
2. expose the sandbox API
3. gather document data inside the sandbox
4. send only plain data back to the panel for rendering

## Why this matters

This sample keeps ownership clean: the sandbox reads and transforms document state, and the panel renders UI and handles user interaction.
