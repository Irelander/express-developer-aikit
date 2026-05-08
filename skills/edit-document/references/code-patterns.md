# Code patterns for document editing

## Sandbox imports

~~~js
import addOnSandboxSdk from "add-on-sdk-document-sandbox";
import { editor } from "express-document-sdk";

const { runtime } = addOnSandboxSdk.instance;
~~~

## Expose one narrow sandbox API

~~~js
runtime.exposeApi({
  async createThing(input) {
    // inspect editor context
    // create or mutate nodes
    // return a small result
  },
});
~~~

## Things to verify

- insertion parent or target node exists
- selection state is valid
- no DOM or fetch logic leaked into sandbox code
