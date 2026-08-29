const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { handleAddonsScan } = require("../src/commands/addons-scan");
const { handleAddonsInspect } = require("../src/commands/addons-inspect");
const {
  searchAddonMarketplaceSnapshot,
  findAddonMarketplaceSnapshotEntry,
  resetAddonMarketplaceSnapshotCache,
} = require("../src/lib/addon-snapshot");

const snapshotManifest = path.join(__dirname, "..", "data", "addon-marketplace-snapshots", "manifest.json");
const snapshotManifestPayload = JSON.parse(fs.readFileSync(snapshotManifest, "utf8"));
const snapshotDate = snapshotManifestPayload.latest.capturedOn;
const snapshotVersion = snapshotManifestPayload.latest.snapshotVersion;
const snapshotCount = snapshotManifestPayload.latest.addonCount;
const snapshotPath = path.resolve(path.dirname(snapshotManifest), snapshotManifestPayload.latest.snapshotPath);

function captureLogs(run) {
  const originalLog = console.log;
  const lines = [];
  console.log = (...args) => {
    lines.push(args.join(" "));
  };

  return Promise.resolve()
    .then(run)
    .then(() => lines)
    .finally(() => {
      console.log = originalLog;
    });
}

test("snapshot manifest count matches the catalog file", () => {
  const addons = JSON.parse(fs.readFileSync(snapshotPath, "utf8"));
  assert.ok(Array.isArray(addons), "snapshot payload must be an array");
  assert.equal(snapshotCount, addons.length);
  assert.ok(addons.length > 0, "expected a non-empty marketplace catalog");
});

test("snapshot search finds relevant addon matches by keywords and description", async () => {
  resetAddonMarketplaceSnapshotCache();
  const results = await searchAddonMarketplaceSnapshot("korean discovery", { snapshotManifest });
  assert.ok(results.addons.length > 0, "expected at least one snapshot hit");
  assert.equal(results.addons[0].name, "Addon Explorer");
  assert.equal(results.metadata.snapshotVersion, snapshotVersion);
});

test("snapshot inspect can find an addon by id", async () => {
  resetAddonMarketplaceSnapshotCache();
  const result = await findAddonMarketplaceSnapshotEntry({ id: "wlgg52gjj", snapshotManifest });
  assert.ok(result.addon, "expected addon to exist in the snapshot");
  assert.equal(result.addon.name, "Accessibility Assistant");
  assert.equal(result.metadata.capturedOn, snapshotDate);
});

test("addons scan supports the snapshot source without loading the entire dataset into output", async () => {
  resetAddonMarketplaceSnapshotCache();
  const lines = await captureLogs(() =>
    handleAddonsScan([
      "--source",
      "snapshot",
      "--query",
      "accessibility",
      "--limit",
      "3",
      "--snapshot-manifest",
      snapshotManifest,
    ]),
  );

  const output = lines.join("\n");
  assert.match(output, /Accessibility Assistant/);
  assert.match(output, new RegExp(`GitHub-hosted addon catalog dated ${snapshotDate}`));
  assert.match(output, new RegExp(`${snapshotCount} addons`));
});

test("addons inspect prints a single snapshot record", async () => {
  resetAddonMarketplaceSnapshotCache();
  const lines = await captureLogs(() =>
    handleAddonsInspect(["--id", "wjkl4l48l", "--snapshot-manifest", snapshotManifest]),
  );
  const output = lines.join("\n");

  assert.match(output, /Addon Explorer/);
  assert.match(output, /localized metadata/);
  assert.match(output, new RegExp(`Snapshot record date: ${snapshotDate}`));
});

test("addons inspect validates required args before touching the snapshot source", async () => {
  resetAddonMarketplaceSnapshotCache();
  await assert.rejects(
    () =>
      handleAddonsInspect([
        "--snapshot-manifest",
        "http://127.0.0.1:9/manifest.json",
      ]),
    /addons inspect requires --id "<addOnId>" or --name "<addon name>"/,
  );
});
