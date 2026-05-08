const fs = require("fs");
const os = require("os");
const path = require("path");

const PROVIDERS = {
  "claude-code": {
    aliases: ["claude", "claudecode"],
    restartRequired: false,
    projectDir: [".claude", "skills"],
    userDir: [".claude", "skills"],
    projectMarkers: [".claude"],
    autoDetect: true,
  },
  vscode: {
    aliases: ["copilot", "github-copilot", "vs-code"],
    restartRequired: false,
    projectDir: [".github", "skills"],
    userDir: [".copilot", "skills"],
    projectMarkers: [],
    autoDetect: false,
  },
  antigravity: {
    aliases: [],
    restartRequired: false,
    projectDir: [".agents", "skills"],
    userDir: [".gemini", "antigravity", "skills"],
    projectMarkers: [],
    autoDetect: false,
  },
  cursor: {
    aliases: [],
    restartRequired: false,
    projectDir: [".cursor", "skills"],
    userDir: [".cursor", "skills"],
    projectMarkers: [".cursor"],
    autoDetect: true,
  },
  codex: {
    aliases: [],
    restartRequired: false,
    projectDir: [".agents", "skills"],
    userDir: [".agents", "skills"],
    projectMarkers: [".codex"],
    autoDetect: true,
  },
};

function getSupportedProviders() {
  return Object.keys(PROVIDERS);
}

function normalizeProviderName(name) {
  if (!name) {
    return null;
  }

  const lowered = name.trim().toLowerCase();
  for (const [providerName, config] of Object.entries(PROVIDERS)) {
    if (providerName === lowered || config.aliases.includes(lowered)) {
      return providerName;
    }
  }

  return null;
}

function parseProviders(value) {
  if (!value) {
    return [];
  }

  const raw = value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  const normalized = raw.map((item) => normalizeProviderName(item));
  const invalid = raw.filter((item, index) => !normalized[index]);

  if (invalid.length > 0) {
    throw new Error(`Unsupported provider: ${invalid.join(", ")}. Supported providers: ${getSupportedProviders().join(", ")}`);
  }

  return [...new Set(normalized)];
}

function detectProjectProviders(workspaceRoot) {
  const detected = [];

  for (const [providerName, config] of Object.entries(PROVIDERS)) {
    if (!config.autoDetect) {
      continue;
    }

    const matched = config.projectMarkers.some((marker) => fs.existsSync(path.join(workspaceRoot, marker)));
    if (matched) {
      detected.push(providerName);
    }
  }

  return [...new Set(detected)];
}

function resolveSkillRoot(provider, scope, workspaceRoot) {
  const config = PROVIDERS[provider];
  const base = scope === "user" ? os.homedir() : workspaceRoot;
  const parts = scope === "user" ? config.userDir : config.projectDir;
  return path.join(base, ...parts);
}

function providerNeedsRestart(provider) {
  return PROVIDERS[provider].restartRequired;
}

module.exports = {
  getSupportedProviders,
  normalizeProviderName,
  parseProviders,
  detectProjectProviders,
  resolveSkillRoot,
  providerNeedsRestart,
};
