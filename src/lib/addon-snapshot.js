const fs = require("fs/promises");
const path = require("path");

const DEFAULT_SNAPSHOT_MANIFEST_URL =
  "https://raw.githubusercontent.com/Irelander/express-developer-aikit/main/data/addon-marketplace-snapshots/manifest.json";
const SNAPSHOT_FETCH_TIMEOUT_MS = 10000;

let cachedSnapshotPromise = null;
let cachedSnapshotKey = null;

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function buildNormalizedFields(addon) {
  const keywords = Array.isArray(addon.keywords) ? addon.keywords.map(normalizeText).filter(Boolean) : [];

  return {
    query: [addon.name, addon.summary, addon.description, keywords.join(" "), addon.paymentType].map(normalizeText).join(" "),
    name: normalizeText(addon.name),
    summary: normalizeText(addon.summary),
    description: normalizeText(addon.description),
    keywords,
  };
}

function scoreAddonMatch(addon, query) {
  const normalizedQuery = normalizeText(query);
  if (!normalizedQuery) {
    return 0;
  }

  const fields = buildNormalizedFields(addon);
  const tokens = normalizedQuery.split(" ").filter(Boolean);

  if (!fields.query.includes(normalizedQuery) && tokens.some((token) => !fields.query.includes(token))) {
    return -1;
  }

  let score = 0;

  if (fields.name === normalizedQuery) score += 500;
  if (fields.name.startsWith(normalizedQuery)) score += 180;
  if (fields.name.includes(normalizedQuery)) score += 140;
  if (fields.summary.includes(normalizedQuery)) score += 90;
  if (fields.description.includes(normalizedQuery)) score += 40;
  if (fields.keywords.includes(normalizedQuery)) score += 120;

  for (const token of tokens) {
    if (fields.name.includes(token)) score += 45;
    if (fields.summary.includes(token)) score += 25;
    if (fields.description.includes(token)) score += 8;
    if (fields.keywords.some((keyword) => keyword.includes(token))) score += 30;
  }

  return score;
}

function getSnapshotManifestResource(override) {
  return override || process.env.EXPRESS_DEVELOPER_AIKIT_SNAPSHOT_MANIFEST || DEFAULT_SNAPSHOT_MANIFEST_URL;
}

function isHttpResource(resource) {
  return /^https?:\/\//i.test(resource);
}

function isFileUrl(resource) {
  return /^file:\/\//i.test(resource);
}

function isAbsoluteFilePath(resource) {
  return path.isAbsolute(resource);
}

async function loadJsonResource(resource) {
  if (isHttpResource(resource)) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), SNAPSHOT_FETCH_TIMEOUT_MS);
    let response;

    try {
      response = await fetch(resource, { signal: controller.signal });
    } catch (error) {
      if (error && error.name === "AbortError") {
        throw new Error(`Timed out while fetching snapshot resource (${resource})`);
      }

      throw new Error(`Failed to fetch snapshot resource (${resource}): ${error.message}`);
    } finally {
      clearTimeout(timeout);
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch snapshot resource: ${response.status} (${resource})`);
    }

    return response.json();
  }

  const filePath = isFileUrl(resource) ? new URL(resource) : resource;
  const text = await fs.readFile(filePath, "utf8");
  return JSON.parse(text);
}

function resolveSnapshotResource(manifestResource, snapshotPath) {
  if (isHttpResource(manifestResource)) {
    if (isHttpResource(snapshotPath) || isFileUrl(snapshotPath) || isAbsoluteFilePath(snapshotPath)) {
      throw new Error(
        `Remote snapshot manifests may only reference relative snapshot paths (${manifestResource} -> ${snapshotPath}).`,
      );
    }

    const resolvedUrl = new URL(snapshotPath, manifestResource);
    const manifestUrl = new URL(manifestResource);
    const manifestDirPath = new URL(".", manifestUrl).pathname;

    if (resolvedUrl.origin !== manifestUrl.origin || !resolvedUrl.pathname.startsWith(manifestDirPath)) {
      throw new Error(
        `Remote snapshot path must stay within the manifest directory and origin (${manifestResource} -> ${snapshotPath}).`,
      );
    }

    return resolvedUrl.toString();
  }

  if (isHttpResource(snapshotPath) || isFileUrl(snapshotPath) || isAbsoluteFilePath(snapshotPath)) {
    return snapshotPath;
  }

  if (isFileUrl(manifestResource)) {
    return new URL(snapshotPath, manifestResource).toString();
  }

  return path.resolve(path.dirname(manifestResource), snapshotPath);
}

function normalizeSnapshotAddons(addons) {
  return addons.map((addon) => ({
    ...addon,
    addOnId: addon.uuid,
    url: addon.redirectUrl,
  }));
}

async function loadAddonMarketplaceSnapshot(options = {}) {
  const manifestResource = getSnapshotManifestResource(options.snapshotManifest);

  if (cachedSnapshotPromise && cachedSnapshotKey === manifestResource) {
    return cachedSnapshotPromise;
  }

  cachedSnapshotKey = manifestResource;
  cachedSnapshotPromise = (async () => {
    const manifest = await loadJsonResource(manifestResource);
    if (!manifest || !manifest.latest || !manifest.latest.snapshotPath) {
      throw new Error(`Snapshot manifest is missing latest snapshot metadata (${manifestResource}).`);
    }

    const snapshotResource = resolveSnapshotResource(manifestResource, manifest.latest.snapshotPath);
    const snapshotPayload = await loadJsonResource(snapshotResource);
    const addons = Array.isArray(snapshotPayload) ? snapshotPayload : snapshotPayload.addons;

    if (!Array.isArray(addons)) {
      throw new Error(`Snapshot payload must be an array of addons (${snapshotResource}).`);
    }

    return {
      metadata: {
        sourceType: manifest.sourceType || "marketplace-catalog-snapshot",
        repoUrl: manifest.repoUrl || "https://github.com/Irelander/express-developer-aikit",
        manifestResource,
        snapshotResource,
        snapshotVersion: manifest.latest.snapshotVersion,
        capturedOn: manifest.latest.capturedOn,
        addonCount: manifest.latest.addonCount,
      },
      addons: normalizeSnapshotAddons(addons),
    };
  })();

  try {
    return await cachedSnapshotPromise;
  } catch (error) {
    cachedSnapshotPromise = null;
    cachedSnapshotKey = null;
    throw error;
  }
}

async function searchAddonMarketplaceSnapshot(query, options = {}) {
  const snapshot = await loadAddonMarketplaceSnapshot(options);
  if (!query) {
    return {
      metadata: snapshot.metadata,
      addons: snapshot.addons,
    };
  }

  const addons = snapshot.addons
    .map((addon) => ({ addon, score: scoreAddonMatch(addon, query) }))
    .filter((entry) => entry.score >= 0)
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }

      return left.addon.name.localeCompare(right.addon.name);
    })
    .map((entry) => entry.addon);

  return {
    metadata: snapshot.metadata,
    addons,
  };
}

async function findAddonMarketplaceSnapshotEntry(options = {}) {
  const snapshot = await loadAddonMarketplaceSnapshot(options);
  const id = normalizeText(options.id);
  const exactName = normalizeText(options.name);

  let addon = null;

  if (id) {
    addon = snapshot.addons.find((entry) => normalizeText(entry.uuid) === id) || null;
  } else if (exactName) {
    addon = snapshot.addons.find((entry) => normalizeText(entry.name) === exactName) || null;

    if (!addon) {
      const searchResults = await searchAddonMarketplaceSnapshot(options.name, options);
      addon = searchResults.addons[0] || null;
    }
  }

  return {
    metadata: snapshot.metadata,
    addon,
  };
}

function resetAddonMarketplaceSnapshotCache() {
  cachedSnapshotPromise = null;
  cachedSnapshotKey = null;
}

function formatSnapshotStamp(metadata) {
  const capturedOn = metadata.capturedOn || "unknown date";
  const versionPart =
    metadata.snapshotVersion && metadata.snapshotVersion !== metadata.capturedOn
      ? ` (version ${metadata.snapshotVersion})`
      : "";
  const countPart = Number.isFinite(metadata.addonCount) ? `, ${metadata.addonCount} addons` : "";
  return `${capturedOn}${versionPart}${countPart}`;
}

module.exports = {
  DEFAULT_SNAPSHOT_MANIFEST_URL,
  loadAddonMarketplaceSnapshot,
  searchAddonMarketplaceSnapshot,
  findAddonMarketplaceSnapshotEntry,
  resetAddonMarketplaceSnapshotCache,
  formatSnapshotStamp,
};
