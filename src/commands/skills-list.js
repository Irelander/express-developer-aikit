const { skills } = require("../data/skills");
const { printKeyValueList } = require("../lib/output");

function handleSkillsList() {
  printKeyValueList(
    skills.map((skill) => ({
      key: skill.name,
      value: `${skill.description} [${skill.stage}]`,
    })),
  );
}

module.exports = {
  handleSkillsList,
};
