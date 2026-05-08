const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const path = require("node:path");
const os = require("node:os");
const { handleSkillsInstall } = require("../src/commands/skills-install");
const { skills } = require("../src/data/skills");

let workspaceRoot;
let originalLog;

before(async () => {
  const created = await fs.mkdtemp(path.join(os.tmpdir(), "express-aikit-tests-"));
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

test("installing a single skill writes SKILL.md with frontmatter and reference files", async () => {
  const dir = path.join(workspaceRoot, "single-skill");
  await fs.mkdir(dir, { recursive: true });

  await handleSkillsInstall(["edit-document", "--provider", "cursor", "--dir", dir]);

  const skillDir = path.join(dir, ".cursor", "skills", "edit-document");
  const skillFile = path.join(skillDir, "SKILL.md");
  assert.ok(await pathExists(skillFile), "SKILL.md should exist");

  const content = await fs.readFile(skillFile, "utf8");
  assert.match(content, /^---\n/, "SKILL.md must start with frontmatter");
  assert.match(content, /name: edit-document/, "SKILL.md must include the skill name");
  assert.match(content, /## Progressive references/, "SKILL.md must list progressive references");

  const refDir = path.join(skillDir, "references");
  assert.ok(await pathExists(refDir), "references directory should exist");
  const entries = await fs.readdir(refDir);
  assert.ok(entries.length > 0, "references directory should contain reference files");

  const samplePath = path.join(refDir, "code-patterns.md");
  assert.ok(await pathExists(samplePath), "expected reference file should be copied");
  const refContent = await fs.readFile(samplePath, "utf8");
  assert.ok(refContent.length > 0, "copied reference content should not be empty");
});

test("installed SKILL.md preserves the skill body from the source markdown", async () => {
  const dir = path.join(workspaceRoot, "body-preserved");
  await fs.mkdir(dir, { recursive: true });

  await handleSkillsInstall(["edit-document", "--provider", "cursor", "--dir", dir]);

  const skillFile = path.join(dir, ".cursor", "skills", "edit-document", "SKILL.md");
  const content = await fs.readFile(skillFile, "utf8");
  assert.match(content, /# Edit Document Content/);
  assert.match(content, /## When to use/);
  assert.match(content, /## Workflow/);
});

test('"all" expands to every defined skill', async () => {
  const dir = path.join(workspaceRoot, "all-skills");
  await fs.mkdir(dir, { recursive: true });

  await handleSkillsInstall(["all", "--provider", "cursor", "--dir", dir]);

  const skillsDir = path.join(dir, ".cursor", "skills");
  const installed = await fs.readdir(skillsDir);
  for (const skill of skills) {
    assert.ok(installed.includes(skill.name), `skill should be installed: ${skill.name}`);
  }
});

test("unknown skill name throws a helpful error", async () => {
  const dir = path.join(workspaceRoot, "unknown-skill");
  await fs.mkdir(dir, { recursive: true });

  await assert.rejects(
    () => handleSkillsInstall(["does-not-exist", "--provider", "cursor", "--dir", dir]),
    /Unknown skill/,
  );
});

test("missing skill name throws a helpful error", async () => {
  const dir = path.join(workspaceRoot, "missing-skill");
  await fs.mkdir(dir, { recursive: true });

  await assert.rejects(
    () => handleSkillsInstall([], { dir }),
    /Missing skill name/,
  );
});

test("codex provider also writes the agents/openai.yaml metadata", async () => {
  const dir = path.join(workspaceRoot, "codex-skill");
  await fs.mkdir(dir, { recursive: true });

  await handleSkillsInstall(["edit-document", "--provider", "codex", "--dir", dir]);

  const agentsFile = path.join(dir, ".agents", "skills", "edit-document", "agents", "openai.yaml");
  assert.ok(await pathExists(agentsFile), "codex skill should expose agents/openai.yaml");
});
