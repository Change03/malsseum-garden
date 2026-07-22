import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const cliPath = fileURLToPath(
  new URL("../node_modules/vinext/dist/cli.js", import.meta.url),
);
const command = process.argv[2] ?? "dev";
const workspace = fileURLToPath(new URL("..", import.meta.url));
const startArgs = command === "start" ? productionPreviewArgs() : null;
const child = spawn(
  process.execPath,
  startArgs ?? [cliPath, command, ...process.argv.slice(3)],
  {
    cwd: workspace,
    stdio: "inherit",
    env: {
      ...process.env,
      ...(startArgs ? { NODE_ENV: "production" } : {}),
      WRANGLER_LOG_PATH: ".wrangler/wrangler.log",
    },
  },
);

child.on("error", (error) => {
  console.error(error);
  process.exitCode = 1;
});

child.on("close", (code) => {
  process.exitCode = code ?? 1;
});

function productionPreviewArgs() {
  const wranglerPath = fileURLToPath(
    new URL("../node_modules/wrangler/bin/wrangler.js", import.meta.url),
  );
  const secrets = parseLocalSecrets(
    readFileSync(new URL("../.dev.vars", import.meta.url), "utf8"),
  );
  const seedSecret = secrets.WORD_GARDEN_SEED_JSON;
  const purgeSecret = secrets.WORD_GARDEN_PURGE_SECRET;
  if (!seedSecret || !purgeSecret) {
    throw new Error("Local preview requires WORD_GARDEN_SEED_JSON and WORD_GARDEN_PURGE_SECRET in .dev.vars");
  }
  const requestedPort = process.argv[3];
  const port = requestedPort && /^\d{2,5}$/u.test(requestedPort)
    ? requestedPort
    : "3000";
  return [
    wranglerPath,
    "dev",
    "--config",
    "dist/server/wrangler.json",
    "--var",
    `WORD_GARDEN_SEED_JSON:${seedSecret}`,
    "--var",
    `WORD_GARDEN_PURGE_SECRET:${purgeSecret}`,
    "--port",
    port,
    "--ip",
    "127.0.0.1",
    "--local",
    "--persist-to",
    ".wrangler/local-preview-state",
    "--log-level",
    "error",
  ];
}

function parseLocalSecrets(raw) {
  return Object.fromEntries(
    raw
      .split(/\r?\n/u)
      .filter(Boolean)
      .map((line) => {
        const separator = line.indexOf("=");
        const value = line.slice(separator + 1);
        const unquoted =
          (value.startsWith("'") && value.endsWith("'")) ||
          (value.startsWith('"') && value.endsWith('"'))
            ? value.slice(1, -1)
            : value;
        return [line.slice(0, separator), unquoted];
      }),
  );
}
