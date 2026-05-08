const TRENDING_URL = "https://developer.adobe.com/express/add-ons/trending/";

function decodeHtml(value) {
  return value
    .replace(/&#x26;/g, "&")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function normalizeWhitespace(value) {
  return value.replace(/\s+/g, " ").trim();
}

function extractCards(html, championHeadingIndex) {
  const cardPattern = /<h1 id="([^"]+)"><strong><a href="([^"]*addOnId=([^"]+))">([^<]+)<\/a><\/strong><\/h1>([\s\S]*?)<\/div>\s*<\/div>/g;
  const addons = [];
  let match = cardPattern.exec(html);

  while (match) {
    const [, slug, url, addOnId, name, trailingContent] = match;
    const paragraphs = [...trailingContent.matchAll(/<p>([\s\S]*?)<\/p>/g)]
      .map((entry) => normalizeWhitespace(decodeHtml(entry[1])))
      .filter(Boolean);

    const category = championHeadingIndex !== -1 && match.index > championHeadingIndex ? "developer-champion" : "trending";

    addons.push({
      slug,
      name: normalizeWhitespace(decodeHtml(name)),
      summary: paragraphs.join(" "),
      category,
      addOnId,
      url: decodeHtml(url),
      source: TRENDING_URL,
    });

    match = cardPattern.exec(html);
  }

  return addons;
}

async function fetchTrendingAddons({ includeChampions = false } = {}) {
  const response = await fetch(TRENDING_URL);

  if (!response.ok) {
    throw new Error(`Failed to fetch trending page: ${response.status}`);
  }

  const html = await response.text();
  const championHeadingIndex = html.indexOf('<h1 id="add-ons-built-by-developer-champions">');
  const addons = extractCards(html, championHeadingIndex);

  if (includeChampions) {
    return addons;
  }

  return addons.filter((addon) => addon.category === "trending");
}

module.exports = {
  fetchTrendingAddons,
};
