const fs = require("fs/promises");
const fsSync = require("fs");
const os = require("os");
const path = require("path");
const { skills, getSkillByName } = require("../data/skills");
const { parseOptions } = require("../lib/args");
const { ensureDir, writeTextFile } = require("../lib/fs-utils");
const { success, note } = require("../lib/output");
const {
  detectProjectProviders,
  getSupportedProviders,
  parseProviders,
  providerNeedsRestart,
  resolveSkillRoot,
} = require("../lib/providers");

function toYamlValue(value) {
  return `"${String(value).replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

function buildProviderFrontmatter(provider, skill) {
  const lines = ["---", `name: ${skill.name}`, `description: ${toYamlValue(skill.description)}`];

  if ((provider === "claude-code" || provider === "vscode") && skill.argumentHint) {
    lines.push(`argument-hint: ${toYamlValue(skill.argumentHint)}`);
  }

  if ((provider === "claude-code" || provider === "vscode" || provider === "cursor") && skill.manualOnly) {
    lines.push("disable-model-invocation: true");
  }

  if ((provider === "claude-code" || provider === "cursor") && skill.paths && skill.paths.length > 0) {
    lines.push("paths:");
    for (const entry of skill.paths) {
      lines.push(`  - ${toYamlValue(entry)}`);
    }
  }

  lines.push("---");
  return lines.join("\n");
}

function buildSkillMarkdown(provider, skill) {
  return `${buildProviderFrontmatter(provider, skill)}\n\n${skill.body.trimEnd()}\n`;
}

function buildCodexMetadata(skill) {
  const sections = [
    "interface:",
    `  display_name: ${toYamlValue(skill.title)}`,
    `  short_description: ${toYamlValue(skill.description)}`,
  ];

  if (skill.manualOnly) {
    sections.push("policy:", "  allow_implicit_invocation: false");
  }

  return sections.join("\n");
}

function resolveWorkspaceRoot(options) {
  return path.resolve(process.cwd(), options.dir || ".");
}

function resolveProviders(options, workspaceRoot) {
  const explicit = parseProviders(options.provider);
  if (explicit.length > 0) {
    return explicit;
  }

  const detected = detectProjectProviders(workspaceRoot);
  if (detected.length === 1) {
    return detected;
  }

  if (detected.length > 1) {
    throw new Error(
      `Detected multiple possible environments (${detected.join(", ")}). Use --provider ${getSupportedProviders().join(",")} to choose explicitly.`,
    );
  }

  throw new Error(
    `Could not detect a supported environment. Use --provider ${getSupportedProviders().join(",")} to choose one explicitly.`,
  );
}

function resolveSkills(skillName) {
  if (!skillName) {
    throw new Error(`Missing skill name. Available skills: ${skills.map((skill) => skill.name).join(", ")}`);
  }

  if (skillName === "all") {
    return skills;
  }

  const skill = getSkillByName(skillName);
  if (!skill) {
    throw new Error(`Unknown skill "${skillName}".`);
  }

  return [skill];
}

async function copyReferenceFiles(skill, skillDir) {
  if (!skill.referenceFiles || skill.referenceFiles.length === 0) return;

  const targetReferencesDir = path.join(skillDir, "references");
  await ensureDir(targetReferencesDir);

  for (const reference of skill.referenceFiles) {
    if (!fsSync.existsSync(reference.absolutePath)) continue;
    const contents = await fs.readFile(reference.absolutePath, "utf8");
    await writeTextFile(path.join(skillDir, reference.path), contents);
  }
}

async function installSkillForProvider(skill, provider, scope, workspaceRoot) {
  const rootDir = resolveSkillRoot(provider, scope, workspaceRoot);
  const skillDir = path.join(rootDir, skill.name);

  await ensureDir(skillDir);
  await writeTextFile(path.join(skillDir, "SKILL.md"), buildSkillMarkdown(provider, skill));
  await copyReferenceFiles(skill, skillDir);

  if (provider === "codex") {
    await ensureDir(path.join(skillDir, "agents"));
    await writeTextFile(path.join(skillDir, "agents", "openai.yaml"), buildCodexMetadata(skill));
  }

  return skillDir;
}

async function handleSkillsInstall(argv) {
  const [skillName, ...rest] = argv;
  const options = parseOptions(rest);
  const scope = options.scope === "user" ? "user" : "project";
  const workspaceRoot = resolveWorkspaceRoot(options);
  const selectedSkills = resolveSkills(skillName);
  const providers = resolveProviders(options, workspaceRoot);
  const installs = [];

  for (const provider of providers) {
    for (const skill of selectedSkills) {
      const installedPath = await installSkillForProvider(skill, provider, scope, workspaceRoot);
      installs.push({ provider, skill: skill.name, installedPath });
    }
  }

  success(`Installed ${selectedSkills.length} skill(s) for ${providers.join(", ")}`);

  for (const install of installs) {
    note(`${install.provider}: ${install.skill} -> ${install.installedPath}`);
  }

  const restartProviders = providers.filter((provider) => providerNeedsRestart(provider));
  if (restartProviders.length > 0) {
    note(`If the new skill does not appear immediately, restart: ${restartProviders.join(", ")}`);
  }

  if (scope === "user") {
    note(`User scope writes under ${os.homedir()}.`);
  }

  if (providers.includes("claude-code") && scope === "project") {
    note("If Claude Code is already running and this is the first .claude/skills directory in the project, restart Claude Code so it begins watching the new directory.");
  }

  note("Skill layouts follow the provider-specific setup guides in this workspace.");
}

module.exports = {
  handleSkillsInstall,
};
