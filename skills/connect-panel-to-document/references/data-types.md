# Supported data types for runtime communication

Safe choices:

- string
- boolean
- number
- undefined
- plain object
- array of primitives or plain objects
- ArrayBuffer
- Blob
- Error

Avoid:

- Map
- Set
- Date
- RegExp
- custom class instances
- functions
- circular objects

When in doubt, convert runtime payloads to plain JSON-like structures before sending them across the bridge.
