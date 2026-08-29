const { parseOptions } = require("../lib/args");
const { findAddonMarketplaceSnapshotEntry, formatSnapshotStamp } = require("../lib/addon-snapshot");
const { note } = require("../lib/output");

function printAddon(addon) {
  console.log(`- ${addon.name}`);
  console.log(`  addOnId: ${addon.uuid}`);
  console.log(`  summary: ${addon.summary}`);
  console.log(`  payment: ${addon.paymentType}`);
  console.log(`  keywords: ${addon.keywords.length > 0 ? addon.keywords.join(", ") : "(none listed)"}`);
  console.log(`  url: ${addon.redirectUrl}`);
  console.log(`  description: ${addon.description}`);
}

async function handleAddonsInspect(argv) {
  const options = parseOptions(argv);

  if (!options.id && !options.name) {
    throw new Error('addons inspect requires --id "<addOnId>" or --name "<addon name>".');
  }

  const json = options.json === true || options.json === "true";
  const snapshotManifest = options["snapshot-manifest"];
  const result = await findAddonMarketplaceSnapshotEntry({
    id: options.id,
    name: options.name,
    snapshotManifest,
  });
  const { addon, metadata } = result;

  if (!addon) {
    throw new Error("No add-on matched the supplied snapshot lookup.");
  }

  if (json) {
    console.log(
      JSON.stringify(
        {
          source: "snapshot",
          snapshot: metadata,
          addon,
        },
        null,
        2,
      ),
    );
  } else {
    printAddon(addon);
    note(`Snapshot record date: ${formatSnapshotStamp(metadata)}`);
    note(`Snapshot source: ${metadata.repoUrl}`);
  }
}

module.exports = {
  handleAddonsInspect,
};
