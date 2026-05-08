const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const path = require("node:path");
const os = require("node:os");
const { PassThrough } = require("node:stream");
const { handleMcpInit } = require("../src/commands/mcp-init");

let workspaceRoot;
let originalLog;

before(async () => {
  const created = await fs.mkdtemp(path.join(os.tmpdir(), "express-aikit-mcp-tests-"));
  workspaceRoot = await fs.realpath(created);
  originalLog = console.log;
  console.log = () => {};
});

after(async () => {
  console.log = originalLog;
  await fs.rm(workspaceRoot, { recursive: true, force: true });
});

async function pathExists(target) {
  try {
    await fs.access(target);
    return true;
  } catch {
    return false;
  }
}

test("mcp init writes only the explicitly requested clients", async () => {
  const dir = path.join(workspaceRoot, "explicit-clients");
  await fs.mkdir(dir, { recursive: true });

  await handleMcpInit(["--clients", "cursor,codex"], { cwd: dir, isTTY: false });

  assert.ok(await pathExists(path.join(dir, ".cursor", "mcp.json")));
  assert.ok(await pathExists(path.join(dir, ".codex", "config.toml")));
  assert.equal(await pathExists(path.join(dir, ".vscode", "mcp.json")), false);
  assert.equal(await pathExists(path.join(dir, ".express-developer-aikit", "mcp-snippets", "claude-desktop.json")), false);
});

test("mcp init fails fast in non-interactive mode without --clients", async () => {
  const dir = path.join(workspaceRoot, "non-interactive-missing-clients");
  await fs.mkdir(dir, { recursive: true });

  await assert.rejects(
    () => handleMcpInit([], { cwd: dir, isTTY: false }),
    /mcp init requires an explicit client selection in non-interactive mode/,
  );
});

test("mcp init prompts for client selection in interactive mode", async () => {
  const dir = path.join(workspaceRoot, "interactive-selection");
  await fs.mkdir(dir, { recursive: true });

  const input = new PassThrough();
  const output = new PassThrough();
  let pauseCalled = false;
  const originalPause = input.pause.bind(input);
  input.pause = () => {
    pauseCalled = true;
    return originalPause();
  };
  input.end(` \u001b[B\u001b[B \r`);

  await handleMcpInit([], { cwd: dir, isTTY: true, input, output });

  assert.ok(await pathExists(path.join(dir, ".cursor", "mcp.json")));
  assert.ok(await pathExists(path.join(dir, ".vscode", "mcp.json")));
  assert.equal(await pathExists(path.join(dir, ".codex", "config.toml")), false);

  const promptText = output.read()?.toString("utf8") || "";
  assert.match(promptText, /Select MCP clients to configure/);
  assert.match(promptText, /Use ↑\/↓ to move, Space to toggle, Enter to confirm/);
  assert.match(promptText, /Selected: cursor, vscode/);
  assert.equal(pauseCalled, true, "interactive prompt should pause input during cleanup");
});
