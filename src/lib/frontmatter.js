function unquote(value) {
  if (
    value.length >= 2 &&
    ((value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'")))
  ) {
    return value
      .slice(1, -1)
      .replace(/\\"/g, '"')
      .replace(/\\\\/g, "\\");
  }
  return value;
}

function parseScalar(value) {
  if (value === "true") return true;
  if (value === "false") return false;
  if (value === "null" || value === "~") return null;
  if (/^-?\d+$/.test(value)) return Number(value);
  return unquote(value);
}

function parseFrontmatter(text) {
  if (typeof text !== "string") {
    return { meta: {}, body: "" };
  }

  const normalized = text.replace(/^﻿/, "");
  if (!normalized.startsWith("---")) {
    return { meta: {}, body: normalized };
  }

  const lines = normalized.split(/\r?\n/);
  if (lines[0] !== "---") {
    return { meta: {}, body: normalized };
  }

  let endIndex = -1;
  for (let i = 1; i < lines.length; i += 1) {
    if (lines[i] === "---") {
      endIndex = i;
      break;
    }
  }

  if (endIndex === -1) {
    return { meta: {}, body: normalized };
  }

  const meta = {};
  let activeListKey = null;

  for (let i = 1; i < endIndex; i += 1) {
    const rawLine = lines[i];
    if (rawLine.trim() === "") {
      activeListKey = null;
      continue;
    }

    const listMatch = rawLine.match(/^\s+-\s+(.*)$/);
    if (listMatch && activeListKey) {
      meta[activeListKey].push(parseScalar(listMatch[1].trim()));
      continue;
    }

    const keyMatch = rawLine.match(/^([A-Za-z_][A-Za-z0-9_-]*):\s*(.*)$/);
    if (!keyMatch) {
      activeListKey = null;
      continue;
    }

    const [, key, rawValue] = keyMatch;
    const value = rawValue.trim();
    if (value === "") {
      meta[key] = [];
      activeListKey = key;
    } else {
      meta[key] = parseScalar(value);
      activeListKey = null;
    }
  }

  const body = lines.slice(endIndex + 1).join("\n").replace(/^\n+/, "");
  return { meta, body };
}

function quote(value) {
  return `"${String(value).replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

function serializeScalar(value) {
  if (typeof value === "boolean") return value ? "true" : "false";
  if (value === null) return "null";
  if (typeof value === "number") return String(value);
  return quote(value);
}

function serializeFrontmatter(meta, keyOrder) {
  const keys = keyOrder
    ? keyOrder.filter((key) => meta[key] !== undefined && meta[key] !== null)
    : Object.keys(meta).filter((key) => meta[key] !== undefined && meta[key] !== null);

  const lines = ["---"];
  for (const key of keys) {
    const value = meta[key];
    if (Array.isArray(value)) {
      if (value.length === 0) continue;
      lines.push(`${key}:`);
      for (const item of value) lines.push(`  - ${serializeScalar(item)}`);
    } else {
      lines.push(`${key}: ${serializeScalar(value)}`);
    }
  }
  lines.push("---");
  return lines.join("\n");
}

module.exports = {
  parseFrontmatter,
  serializeFrontmatter,
};
