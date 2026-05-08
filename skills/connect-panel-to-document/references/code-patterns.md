# Code patterns for panel and document communication

## Panel side

~~~js
addOnUISdk.ready.then(async () => {
  const { runtime } = addOnUISdk.instance;
  const sandboxProxy = await runtime.apiProxy("documentSandbox");
  await sandboxProxy.performWork({ value: 1 });
});
~~~

## Sandbox side

~~~js
const { runtime } = addOnSandboxSdk.instance;

runtime.exposeApi({
  async performWork(input) {
    return { ok: true, input };
  },
});
~~~
