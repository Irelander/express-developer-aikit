# Sample walkthrough

## express-stats-addon sandbox pattern

Source: https://github.com/AdobeDocs/express-add-on-samples/blob/main/document-sandbox-samples/express-stats-addon/src/documentSandbox/code.js

What it demonstrates:

- import the sandbox SDK and editor APIs at the top
- get a panel proxy before the sandbox starts returning data back to UI
- expose one named sandbox method instead of mixing multiple unrelated operations
- iterate document pages and transform document state into plain data before crossing runtimes

## What to copy from it

- keep sandbox output plain and serializable
- let the panel own rendering of tables, lists, and other UI artifacts
- log from sandbox when debugging because that runtime is isolated

## editor-apis sample focus

Source: https://github.com/AdobeDocs/express-add-on-samples/tree/main/document-sandbox-samples/editor-apis

Use that sample when you need examples of node creation, editor context usage, and element mutation patterns rather than UI communication.
