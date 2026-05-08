const { test } = require("node:test");
const assert = require("node:assert/strict");
const { parseFrontmatter, serializeFrontmatter } = require("../src/lib/frontmatter");

test("parses simple key/value frontmatter", () => {
  const { meta, body } = parseFrontmatter(`---\nname: hello\ndescription: "a thing"\n---\n\nhello\n`);
  assert.equal(meta.name, "hello");
  assert.equal(meta.description, "a thing");
  assert.equal(body, "hello\n");
});

test("parses list values", () => {
  const text = `---\npaths:\n  - "foo"\n  - "bar"\n---\n\nbody`;
  const { meta } = parseFrontmatter(text);
  assert.deepEqual(meta.paths, ["foo", "bar"]);
});

test("parses booleans, numbers, and null", () => {
  const text = `---\nmanualOnly: true\ndraft: false\ncount: 3\nempty: null\n---\n`;
  const { meta } = parseFrontmatter(text);
  assert.equal(meta.manualOnly, true);
  assert.equal(meta.draft, false);
  assert.equal(meta.count, 3);
  assert.equal(meta.empty, null);
});

test("returns empty meta when frontmatter is missing", () => {
  const { meta, body } = parseFrontmatter("just a body\n");
  assert.deepEqual(meta, {});
  assert.equal(body, "just a body\n");
});

test("returns empty meta when closing delimiter is missing", () => {
  const { meta, body } = parseFrontmatter("---\nname: x\n");
  assert.deepEqual(meta, {});
  assert.equal(body, "---\nname: x\n");
});

test("unescapes quoted strings with embedded quotes", () => {
  const { meta } = parseFrontmatter(`---\ndescription: "say \\"hi\\""\n---\n`);
  assert.equal(meta.description, 'say "hi"');
});

test("serializes meta back to a frontmatter block", () => {
  const out = serializeFrontmatter({ name: "x", description: "a", paths: ["one", "two"] });
  assert.match(out, /^---\nname: "x"\ndescription: "a"\npaths:\n  - "one"\n  - "two"\n---$/);
});

test("serializeFrontmatter respects keyOrder and skips empty arrays", () => {
  const out = serializeFrontmatter(
    { name: "x", description: "a", paths: [], manualOnly: true },
    ["name", "description", "manualOnly", "paths"],
  );
  assert.equal(out, `---\nname: "x"\ndescription: "a"\nmanualOnly: true\n---`);
});
