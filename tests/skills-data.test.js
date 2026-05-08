const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { skills, getSkillByName, SKILLS_ROOT } = require("../src/data/skills");
const { parseFrontmatter } = require("../src/lib/frontmatter");

test("skills/ directory contains at least one skill", () => {
  assert.ok(skills.length > 0, "skills loader should find at least one skill in skills/");
});

test("every loaded skill exposes the required identity fields", () => {
  for (const skill of skills) {
    assert.equal(typeof skill.name, "string", `skill.name must be a string`);
    assert.ok(skill.name.length > 0, `skill.name must be non-empty: ${JSON.stringify(skill)}`);
    assert.equal(typeof skill.title, "string", `${skill.name}: title must be a string`);
    assert.equal(typeof skill.description, "string", `${skill.name}: description must be a string`);
    assert.ok(skill.description.length > 0, `${skill.name}: description must be non-empty`);
  }
});

test("skill names are unique and match their directory names", () => {
  const seen = new Set();
  for (const skill of skills) {
    assert.ok(!seen.has(skill.name), `duplicate skill name: ${skill.name}`);
    seen.add(skill.name);
    const dirName = path.basename(skill.skillDir);
    assert.equal(dirName, skill.name, `skill name (${skill.name}) must match directory name (${dirName})`);
  }
});

test("getSkillByName returns the matching skill or undefined", () => {
  assert.equal(getSkillByName("does-not-exist"), undefined);
  for (const skill of skills) {
    assert.equal(getSkillByName(skill.name), skill);
  }
});

test("every reference file declared in the loader exists on disk", () => {
  for (const skill of skills) {
    for (const reference of skill.referenceFiles) {
      assert.ok(
        fs.existsSync(reference.absolutePath),
        `${skill.name}: reference ${reference.path} must exist on disk`,
      );
      const stat = fs.statSync(reference.absolutePath);
      assert.ok(stat.size > 0, `${skill.name}: reference ${reference.path} must not be empty`);
    }
  }
});

test("SKILL.md frontmatter parses and includes name + description", () => {
  for (const skill of skills) {
    const text = fs.readFileSync(skill.skillFile, "utf8");
    const { meta } = parseFrontmatter(text);
    assert.equal(meta.name, skill.name);
    assert.equal(meta.description, skill.description);
  }
});

test("each Progressive references link in SKILL.md points to an existing reference file", () => {
  const linkPattern = /\]\(\.\/(references\/[^)]+\.md)\)/g;
  for (const skill of skills) {
    const text = fs.readFileSync(skill.skillFile, "utf8");
    const declaredPaths = new Set();
    let match;
    while ((match = linkPattern.exec(text)) !== null) {
      declaredPaths.add(match[1]);
    }

    for (const linked of declaredPaths) {
      const target = path.join(skill.skillDir, linked);
      assert.ok(
        fs.existsSync(target),
        `${skill.name}: SKILL.md links to ${linked} but the file does not exist`,
      );
    }
  }
});

test("no orphan reference files (every file in references/ is linked from SKILL.md)", () => {
  for (const skill of skills) {
    const text = fs.readFileSync(skill.skillFile, "utf8");
    for (const reference of skill.referenceFiles) {
      const expected = `(./${reference.path})`;
      assert.ok(
        text.includes(expected),
        `${skill.name}: ${reference.path} exists but is not referenced from SKILL.md`,
      );
    }
  }
});

test("SKILLS_ROOT is exported and points to the skills directory on disk", () => {
  assert.ok(fs.existsSync(SKILLS_ROOT), "SKILLS_ROOT must exist on disk");
  assert.equal(path.basename(SKILLS_ROOT), "skills");
});
