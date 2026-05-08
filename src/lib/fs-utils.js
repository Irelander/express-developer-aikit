const fs = require("fs/promises");
const path = require("path");

async function ensureDir(directoryPath) {
  await fs.mkdir(directoryPath, { recursive: true });
}

async function assertNoSymlinkPath(targetPath) {
  const absolutePath = path.resolve(targetPath);
  const { root } = path.parse(absolutePath);
  const segments = absolutePath.slice(root.length).split(path.sep).filter(Boolean);
  let currentPath = root;

  for (const segment of segments) {
    currentPath = path.join(currentPath, segment);
    const stat = await fs.lstat(currentPath);
    if (stat.isSymbolicLink()) {
      throw new Error(`Refusing to write through symlinked path: ${currentPath}`);
    }
  }
}

async function prepareSafeWrite(filePath) {
  const directoryPath = path.dirname(filePath);
  await ensureDir(directoryPath);
  await assertNoSymlinkPath(directoryPath);

  try {
    await assertNoSymlinkPath(filePath);
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }
  }
}

async function writeJsonFile(filePath, data) {
  await prepareSafeWrite(filePath);
  await fs.writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

async function writeTextFile(filePath, contents) {
  await prepareSafeWrite(filePath);
  await fs.writeFile(filePath, `${contents.trimEnd()}\n`, "utf8");
}

module.exports = {
  ensureDir,
  writeJsonFile,
  writeTextFile,
};
