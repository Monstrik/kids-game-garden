#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const VALID_BUMPS = new Set(["patch", "minor", "major"]);

function parseArgs(argv) {
  const bumpType = argv.find((arg) => VALID_BUMPS.has(arg)) || "patch";
  const dryRun = argv.includes("--dry-run");
  return { bumpType, dryRun };
}

function bumpSemver(version, bumpType) {
  const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(version);
  if (!match) {
    throw new Error(`Unsupported version format: ${version}`);
  }

  const major = Number(match[1]);
  const minor = Number(match[2]);
  const patch = Number(match[3]);

  if (bumpType === "major") {
    return `${major + 1}.0.0`;
  }

  if (bumpType === "minor") {
    return `${major}.${minor + 1}.0`;
  }

  return `${major}.${minor}.${patch + 1}`;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function main() {
  const { bumpType, dryRun } = parseArgs(process.argv.slice(2));
  const rootDir = path.resolve(__dirname, "..");
  const packagePath = path.join(rootDir, "package.json");
  const versionPath = path.join(rootDir, "version.json");

  const packageJson = readJson(packagePath);
  const currentVersion = packageJson.version;
  const nextVersion = bumpSemver(currentVersion, bumpType);

  if (dryRun) {
    console.log(`[dry-run] ${currentVersion} -> ${nextVersion} (${bumpType})`);
    return;
  }

  packageJson.version = nextVersion;
  writeJson(packagePath, packageJson);

  const versionJson = fs.existsSync(versionPath) ? readJson(versionPath) : {};
  versionJson.version = nextVersion;
  writeJson(versionPath, versionJson);

  console.log(`Version bumped: ${currentVersion} -> ${nextVersion} (${bumpType})`);
}

main();
