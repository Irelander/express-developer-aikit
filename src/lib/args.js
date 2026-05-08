function parseOptions(argv) {
  const options = {};

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];

    if (!token.startsWith("--")) {
      continue;
    }

    const trimmed = token.slice(2);

    if (trimmed.includes("=")) {
      const [key, value] = trimmed.split(/=(.*)/s, 2);
      options[key] = value;
      continue;
    }

    const next = argv[index + 1];
    if (!next || next.startsWith("--")) {
      options[trimmed] = true;
      continue;
    }

    options[trimmed] = next;
    index += 1;
  }

  return options;
}

function parseListOption(value, allowedValues) {
  if (!value) {
    return [];
  }

  const parsed = value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  const invalid = parsed.filter((item) => !allowedValues.includes(item));
  if (invalid.length > 0) {
    throw new Error(`Unsupported values: ${invalid.join(", ")}. Allowed values: ${allowedValues.join(", ")}`);
  }

  return parsed;
}

module.exports = {
  parseOptions,
  parseListOption,
};
