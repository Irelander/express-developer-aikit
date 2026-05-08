const fs = require("fs");
const path = require("path");
const { parseFrontmatter } = require("../lib/frontmatter");

const SKILLS_ROOT = path.join(__dirname, "..", "..", "skills");

function loadReferenceFiles(skillDir) {
  const referencesDir = path.join(skillDir, "references");
  if (!fs.existsSync(referencesDir)) return [];

  const entries = fs
    .readdirSync(referencesDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .sort((a, b) => a.name.localeCompare(b.name));

  return entries.map((entry) => ({
    path: `references/${entry.name}`,
    name: entry.name,
    absolutePath: path.join(referencesDir, entry.name),
  }));
}

function loadSkill(skillName) {
  const skillDir = path.join(SKILLS_ROOT, skillName);
  const skillFile = path.join(skillDir, "SKILL.md");
  if (!fs.existsSync(skillFile)) return null;

  const text = fs.readFileSync(skillFile, "utf8");
  const { meta, body } = parseFrontmatter(text);

  if (!meta.name || !meta.description) {
    throw new Error(
      `skills/${skillName}/SKILL.md is missing required frontmatter fields (name, description)`,
    );
  }

  return {
    name: meta.name,
    title: meta.title || meta.name,
    description: meta.description,
    stage: meta.stage,
    paths: Array.isArray(meta.paths) ? meta.paths : [],
    argumentHint: meta.argumentHint,
    manualOnly: meta.manualOnly === true,
    skillDir,
    skillFile,
    body,
    referenceFiles: loadReferenceFiles(skillDir),
  };
}

function loadSkills() {
  if (!fs.existsSync(SKILLS_ROOT)) return [];

  const entries = fs
    .readdirSync(SKILLS_ROOT, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));

  const loaded = [];
  for (const name of entries) {
    const skill = loadSkill(name);
    if (skill) loaded.push(skill);
  }
  return loaded;
}

const skills = loadSkills();

function getSkillByName(name) {
  return skills.find((skill) => skill.name === name);
}

module.exports = {
  skills,
  getSkillByName,
  SKILLS_ROOT,
};
