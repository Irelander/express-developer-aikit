const { printHelp, printUnknownCommand } = require("./commands/help");
const { handleMcpInit } = require("./commands/mcp-init");
const { handleSkillsList } = require("./commands/skills-list");
const { handleSkillsInstall } = require("./commands/skills-install");
const { handleAddonsScan } = require("./commands/addons-scan");
const { handleAddonsInspect } = require("./commands/addons-inspect");

async function run(argv) {
  if (argv.length === 0 || argv.includes("--help") || argv.includes("-h")) {
    printHelp();
    return;
  }

  const [group, command, ...rest] = argv;

  if (group === "mcp" && command === "init") {
    await handleMcpInit(rest);
    return;
  }

  if (group === "skills" && command === "list") {
    handleSkillsList(rest);
    return;
  }

  if (group === "skills" && command === "install") {
    await handleSkillsInstall(rest);
    return;
  }

  if (group === "addons" && command === "scan") {
    await handleAddonsScan(rest);
    return;
  }

  if (group === "addons" && command === "inspect") {
    await handleAddonsInspect(rest);
    return;
  }

  printUnknownCommand(argv.join(" "));
}

module.exports = {
  run,
};
