const path = require("path");
const { emitKeypressEvents } = require("readline");
const { parseOptions, parseListOption } = require("../lib/args");
const { ensureDir, writeJsonFile, writeTextFile } = require("../lib/fs-utils");
const { note, success } = require("../lib/output");

const SUPPORTED_CLIENTS = ["cursor", "claude-desktop", "vscode", "antigravity", "codex"];
const ANSI = {
  reset: "\u001b[0m",
  bold: "\u001b[1m",
  dim: "\u001b[2m",
  cyan: "\u001b[36m",
  green: "\u001b[32m",
  yellow: "\u001b[33m",
  inverse: "\u001b[7m",
  hideCursor: "\u001b[?25l",
  showCursor: "\u001b[?25h",
};

function buildServerConfig() {
  return {
    command: "npx",
    args: ["-y", "@adobe/express-developer-mcp"],
  };
}

function buildGenericInstructionSnippet() {
  return [
    "Use the Adobe Express Developer MCP server first whenever the task involves Adobe Express add-ons, APIs, manifests, Document APIs, or UI SDK details.",
    "Keep iframe UI code separate from document sandbox logic.",
    "Prefer official Adobe Express terminology like Document API, add-on UI SDK, runtime.apiProxy(), and runtime.exposeApi().",
  ].join("\n");
}

function buildCodexToml() {
  return [
    "[mcp_servers.adobe_express]",
    'command = "npx"',
    'args = ["-y", "@adobe/express-developer-mcp"]',
    "",
    '# Suggested instruction snippet:',
    '# Always use the Adobe Express MCP server for Adobe Express add-on work before falling back to general web knowledge.',
  ].join("\n");
}

function colorize(enabled, code, text) {
  return enabled ? `${code}${text}${ANSI.reset}` : text;
}

function buildPromptLines(selected, activeIndex, message, useColor) {
  const lines = [];
  lines.push(colorize(useColor, ANSI.bold, "Select MCP clients to configure"));
  lines.push(colorize(useColor, ANSI.dim, "Use ↑/↓ to move, Space to toggle, Enter to confirm."));
  lines.push(colorize(useColor, ANSI.dim, "Press A to toggle all. Press Q to cancel."));
  lines.push("");

  SUPPORTED_CLIENTS.forEach((client, index) => {
    const isActive = index === activeIndex;
    const isSelected = selected.has(client);
    const marker = isSelected ? colorize(useColor, ANSI.green, "●") : colorize(useColor, ANSI.dim, "○");
    const line = `${marker} ${client}`;
    lines.push(isActive ? colorize(useColor, ANSI.inverse, ` ${line} `) : `  ${line}`);
  });

  lines.push("");
  if (message) {
    lines.push(colorize(useColor, ANSI.yellow, message));
  }

  const summary = selected.size > 0 ? `Selected: ${Array.from(selected).join(", ")}` : "Selected: none";
  lines.push(colorize(useColor, ANSI.cyan, summary));
  return lines;
}

function clearPromptFrame(output, lineCount) {
  if (lineCount <= 0) {
    return;
  }

  for (let index = 0; index < lineCount; index += 1) {
    output.write("\u001b[2K\r");
    if (index < lineCount - 1) {
      output.write("\u001b[1A");
    }
  }
}

function renderPromptFrame(output, selected, activeIndex, message, useColor, previousLineCount) {
  const lines = buildPromptLines(selected, activeIndex, message, useColor);
  clearPromptFrame(output, previousLineCount);
  output.write(`${lines.join("\n")}\n`);
  return lines.length;
}

async function promptForClients({ input = process.stdin, output = process.stdout } = {}) {
  const useColor = output.isTTY !== false;
  const selected = new Set();
  let activeIndex = 0;
  let previousLineCount = 0;
  let message = "";

  emitKeypressEvents(input);

  if (typeof input.setRawMode === "function") {
    input.setRawMode(true);
  }

  if (typeof input.resume === "function") {
    input.resume();
  }

  output.write(ANSI.hideCursor);
  previousLineCount = renderPromptFrame(output, selected, activeIndex, message, useColor, previousLineCount);

  return new Promise((resolve, reject) => {
    function cleanup() {
      input.removeListener("keypress", onKeypress);
      if (typeof input.setRawMode === "function") {
        input.setRawMode(false);
      }
      if (typeof input.pause === "function") {
        input.pause();
      }
      clearPromptFrame(output, previousLineCount);
      output.write(ANSI.showCursor);
      output.write("\r");
    }

    function rerender(nextMessage = message) {
      message = nextMessage;
      previousLineCount = renderPromptFrame(output, selected, activeIndex, message, useColor, previousLineCount);
    }

    function onKeypress(_, key = {}) {
      if (key.ctrl && key.name === "c") {
        cleanup();
        reject(new Error("Cancelled MCP client selection."));
        return;
      }

      if (key.name === "up") {
        activeIndex = (activeIndex - 1 + SUPPORTED_CLIENTS.length) % SUPPORTED_CLIENTS.length;
        rerender("");
        return;
      }

      if (key.name === "down") {
        activeIndex = (activeIndex + 1) % SUPPORTED_CLIENTS.length;
        rerender("");
        return;
      }

      if (key.name === "space") {
        const activeClient = SUPPORTED_CLIENTS[activeIndex];
        if (selected.has(activeClient)) {
          selected.delete(activeClient);
        } else {
          selected.add(activeClient);
        }
        rerender("");
        return;
      }

      if (key.name === "a") {
        if (selected.size === SUPPORTED_CLIENTS.length) {
          selected.clear();
        } else {
          SUPPORTED_CLIENTS.forEach((client) => selected.add(client));
        }
        rerender("");
        return;
      }

      if (key.name === "q" || key.name === "escape") {
        cleanup();
        reject(new Error("Cancelled MCP client selection."));
        return;
      }

      if (key.name === "return" || key.name === "enter") {
        if (selected.size === 0) {
          rerender("Choose at least one client before continuing.");
          return;
        }

        const resolved = Array.from(selected);
        cleanup();
        resolve(resolved);
      }
    }

    input.on("keypress", onKeypress);
  });
}

async function resolveTargetClients(options, ioOverrides) {
  const clients = parseListOption(options.clients, SUPPORTED_CLIENTS);
  if (clients.length > 0) {
    return clients;
  }

  const isInteractive = ioOverrides.isTTY ?? (process.stdin.isTTY && process.stdout.isTTY);
  if (!isInteractive) {
    throw new Error(
      `mcp init requires an explicit client selection in non-interactive mode. Re-run with --clients ${SUPPORTED_CLIENTS.join(",")}.`,
    );
  }

  return promptForClients(ioOverrides);
}

async function handleMcpInit(argv, ioOverrides = {}) {
  const options = parseOptions(argv);
  const targetClients = await resolveTargetClients(options, ioOverrides);
  const cwd = ioOverrides.cwd || process.cwd();
  const artifactRoot = path.join(cwd, ".express-developer-aikit");
  const snippetRoot = path.join(artifactRoot, "mcp-snippets");

  await ensureDir(artifactRoot);
  await ensureDir(snippetRoot);

  const serverConfig = buildServerConfig();

  if (targetClients.includes("cursor")) {
    await writeJsonFile(path.join(cwd, ".cursor", "mcp.json"), {
      mcpServers: {
        adobeExpress: serverConfig,
      },
    });
  }

  if (targetClients.includes("vscode")) {
    await writeJsonFile(path.join(cwd, ".vscode", "mcp.json"), {
      servers: {
        adobeExpress: {
          type: "stdio",
          command: serverConfig.command,
          args: serverConfig.args,
        },
      },
    });
  }

  if (targetClients.includes("codex")) {
    await writeTextFile(path.join(cwd, ".codex", "config.toml"), buildCodexToml());
  }

  if (targetClients.includes("claude-desktop")) {
    await writeJsonFile(path.join(snippetRoot, "claude-desktop.json"), {
      mcpServers: {
        adobeExpress: serverConfig,
      },
    });
  }

  if (targetClients.includes("antigravity")) {
    await writeJsonFile(path.join(snippetRoot, "antigravity.json"), {
      mcpServers: {
        adobeExpress: serverConfig,
      },
    });
  }

  await writeTextFile(path.join(artifactRoot, "AGENTS.express.md"), buildGenericInstructionSnippet());

  success(`Created MCP artifacts for: ${targetClients.join(", ")}`);
  note("Project-local files were written where stable formats are documented.");
  note("Claude Desktop and Antigravity receive paste-ready snippets under .express-developer-aikit/mcp-snippets/ to avoid modifying global user config unexpectedly.");
}

module.exports = {
  handleMcpInit,
};
