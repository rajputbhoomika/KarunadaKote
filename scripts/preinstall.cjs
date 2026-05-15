const fs = require("fs");
const path = require("path");

function rmIfExists(file) {
  const p = path.resolve(__dirname, "..", file);
  try {
    fs.rmSync(p, { force: true });
  } catch {
    // ignore
  }
}

function ensurePnpm() {
  const ua = process.env.npm_config_user_agent || "";
  if (!ua.startsWith("pnpm/")) {
    console.error("Use pnpm instead");
    process.exit(1);
  }
}

function main() {
  rmIfExists("package-lock.json");
  rmIfExists("yarn.lock");
  ensurePnpm();
}

main();
