const path = require("path");
const net = require("net");
const { spawn } = require("child_process");

const projectRoot = path.resolve(__dirname, "..");
const pnpmCmd = process.platform === "win32" ? "pnpm.cmd" : "pnpm";

function buildEnv() {
  const env = { ...process.env };

  // Replit-specific env wiring (safe to ignore locally)
  if (env.REPLIT_EXPO_DEV_DOMAIN) {
    env.EXPO_PACKAGER_PROXY_URL = `https://${env.REPLIT_EXPO_DEV_DOMAIN}`;
  }
  if (env.REPLIT_DEV_DOMAIN) {
    env.EXPO_PUBLIC_DOMAIN = env.REPLIT_DEV_DOMAIN;
    env.REACT_NATIVE_PACKAGER_HOSTNAME = env.REPLIT_DEV_DOMAIN;
  }
  if (env.REPL_ID) {
    env.EXPO_PUBLIC_REPL_ID = env.REPL_ID;
  }

  return env;
}

function isPortFree(port) {
  return new Promise((resolve) => {
    const server = net
      .createServer()
      .once("error", () => resolve(false))
      .once("listening", () => {
        server.close(() => resolve(true));
      })
      .listen(port, "127.0.0.1");
  });
}

async function pickPort(preferredPort) {
  for (let port = preferredPort; port < preferredPort + 20; port++) {
    // eslint-disable-next-line no-await-in-loop
    if (await isPortFree(port)) return port;
  }
  return preferredPort;
}

async function main() {
  const env = buildEnv();

  const preferred = Number(env.PORT || 8081) || 8081;
  const port = await pickPort(preferred);

  const args = ["exec", "expo", "start", "--localhost", "--port", String(port)];

  const child = spawn(pnpmCmd, args, {
    cwd: projectRoot,
    env,
    stdio: "inherit",
    shell: process.platform === "win32",
    windowsHide: true,
  });

  child.on("exit", (code) => process.exit(code ?? 1));
  child.on("error", (err) => {
    console.error(err);
    process.exit(1);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
