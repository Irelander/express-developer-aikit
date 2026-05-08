const { parseOptions } = require("../lib/args");
const { fetchTrendingAddons } = require("../lib/adobe-trending");
const { searchAddonMarketplaceSnapshot } = require("../lib/addon-snapshot");
const { note } = require("../lib/output");

function formatSnapshotStamp(metadata) {
  if (!metadata.snapshotVersion || metadata.snapshotVersion === metadata.capturedOn) {
    return `dated ${metadata.capturedOn}`;
  }

  return `dated ${metadata.capturedOn} (version ${metadata.snapshotVersion})`;
}

function filterAddons(addons, query) {
  if (!query) {
    return addons;
  }

  const normalized = query.toLowerCase();
  return addons.filter((addon) => {
    return addon.name.toLowerCase().includes(normalized) || addon.summary.toLowerCase().includes(normalized);
  });
}

function printTable(addons, source) {
  for (const addon of addons) {
    console.log(`- ${addon.name}`);
    console.log(`  summary: ${addon.summary}`);

    if (source === "snapshot") {
      console.log(`  keywords: ${addon.keywords.length > 0 ? addon.keywords.slice(0, 6).join(", ") : "(none listed)"}`);
      console.log(`  payment: ${addon.paymentType}`);
      console.log(`  addOnId: ${addon.uuid}`);
      console.log(`  url: ${addon.redirectUrl}`);
      continue;
    }

    console.log(`  category: ${addon.category}`);
    console.log(`  addOnId: ${addon.addOnId}`);
    console.log(`  url: ${addon.url}`);
  }
}

async function handleAddonsScan(argv) {
  const options = parseOptions(argv);
  const source = options.source || "trending";

  if (source !== "trending" && source !== "snapshot") {
    throw new Error(`Unsupported source "${source}". Supported sources: trending, snapshot.`);
  }

  const includeChampions = options["include-champions"] === "true" || options["include-champions"] === true;
  const limit = options.limit ? Number.parseInt(options.limit, 10) : undefined;
  const query = options.query;
  const json = options.json === true || options.json === "true";
  const snapshotManifest = options["snapshot-manifest"];

  const snapshotSearch =
    source === "snapshot"
      ? await searchAddonMarketplaceSnapshot(query, { snapshotManifest })
      : null;
  const addons = source === "snapshot" ? snapshotSearch.addons : await fetchTrendingAddons({ includeChampions });
  const filtered = source === "snapshot" ? addons : filterAddons(addons, query);
  const limited = Number.isFinite(limit) ? filtered.slice(0, limit) : filtered;

  if (json) {
    if (source === "snapshot") {
      console.log(
        JSON.stringify(
          {
            source,
            snapshot: snapshotSearch.metadata,
            addons: limited,
          },
          null,
          2,
        ),
      );
      return;
    }

    console.log(JSON.stringify(limited, null, 2));
  } else {
    printTable(limited, source);

    if (source === "snapshot") {
      note(`Snapshot search uses the manually collected GitHub-hosted addon catalog ${formatSnapshotStamp(snapshotSearch.metadata)}.`);
      note(`Snapshot source: ${snapshotSearch.metadata.repoUrl}`);
    } else {
      note(
        "Live trending still comes from Adobe's official surface. Use --source snapshot for the broader manually collected marketplace snapshot.",
      );
    }
  }
}

module.exports = {
  handleAddonsScan,
};
