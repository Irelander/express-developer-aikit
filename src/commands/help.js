function printHelp() {
  console.log(`
express-developer-aikit

CLI for Adobe Express add-on workflows.

Usage:
  express-developer-aikit mcp init [options]
  express-developer-aikit skills list
  express-developer-aikit skills install <skill-name> [options]
  express-developer-aikit addons scan [options]
  express-developer-aikit addons inspect [options]

Commands:
  mcp init          Generate Adobe Express MCP config files and snippets.
  skills list       Show built-in skills shipped with the kit.
  skills install    Install built-in skills for a specific client environment.
  addons scan       Scan official trending data or the dated GitHub marketplace snapshot.
  addons inspect    Show one add-on from the GitHub-hosted marketplace snapshot.

Examples:
  express-developer-aikit mcp init
  express-developer-aikit mcp init --clients cursor,vscode,codex
  express-developer-aikit skills list
  express-developer-aikit skills install express-addon-idea-brainstorm --provider cursor
  express-developer-aikit skills install start-addon --provider claude-code
  express-developer-aikit skills install all --provider codex --scope user
  express-developer-aikit addons scan --source trending --json
  express-developer-aikit addons scan --source snapshot --query accessibility --limit 5
  express-developer-aikit addons inspect --name "Accessibility Assistant"
  express-developer-aikit addons inspect --id wlgg52gjj
`);
}

function printUnknownCommand(commandText) {
  console.error(`Unknown command: ${commandText}`);
  console.log("Run with --help to see available commands.");
}

module.exports = {
  printHelp,
  printUnknownCommand,
};
