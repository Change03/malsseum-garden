import assert from "node:assert/strict";
import { spawn, spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { after, test } from "node:test";

const robotsNoIndexMeta =
  /<meta(?=[^>]*\bname=["']robots["'])(?=[^>]*\bcontent=["'][^"']*noindex)[^>]*>/i;

const origin = "http://127.0.0.1:32123";
const wranglerPath = fileURLToPath(
  new URL("../node_modules/wrangler/bin/wrangler.js", import.meta.url),
);
const workspace = fileURLToPath(new URL("..", import.meta.url));
const localSecrets = Object.fromEntries(
  readFileSync(new URL("../.dev.vars", import.meta.url), "utf8")
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
const seedSecret = localSecrets.WORD_GARDEN_SEED_JSON;
const purgeSecret = localSecrets.WORD_GARDEN_PURGE_SECRET;
assert.ok(seedSecret && purgeSecret, "Local integration secrets are required.");
let serverOutput = "";
const server = spawn(
  process.execPath,
  [
    wranglerPath,
    "dev",
    "--config",
    "dist/server/wrangler.json",
    "--var",
    `WORD_GARDEN_SEED_JSON:${seedSecret}`,
    "--var",
    `WORD_GARDEN_PURGE_SECRET:${purgeSecret}`,
    "--port",
    "32123",
    "--ip",
    "127.0.0.1",
    "--local",
    "--persist-to",
    ".wrangler/integration-state",
    "--log-level",
    "error",
  ],
  {
    cwd: workspace,
    env: { ...process.env, NODE_ENV: "production" },
    windowsHide: true,
  },
);
server.stdout.on("data", (chunk) => { serverOutput += chunk.toString(); });
server.stderr.on("data", (chunk) => { serverOutput += chunk.toString(); });
after(() => {
  if (process.platform === "win32" && server.pid) {
    spawnSync("taskkill", ["/pid", String(server.pid), "/t", "/f"], {
      windowsHide: true,
      stdio: "ignore",
    });
  } else {
    server.kill("SIGTERM");
  }
});

for (let attempt = 0; attempt < 150; attempt += 1) {
  try {
    const response = await fetch(origin);
    if (response.status > 0) break;
  } catch {
    if (server.exitCode !== null || attempt === 149) {
      throw new Error(`Production server did not start.\n${serverOutput.slice(-2_000)}`);
    }
  }
  await new Promise((resolve) => setTimeout(resolve, 100));
}

function request(pathname, init = {}) {
  return fetch(new URL(pathname, origin), init);
}

test("완성된 말씀정원 문서와 검색 차단 메타데이터를 렌더링한다", async () => {
  const response = await request("/", {
    headers: { accept: "text/html" },
  });

  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>[^<]*말씀정원[^<]*<\/title>/i);
  assert.match(html, robotsNoIndexMeta);
  assert.doesNotMatch(html, /codex-preview/i);
  assert.doesNotMatch(html, /Your site is taking shape|Codex is working/i);
  assert.doesNotMatch(html, /react-loading-skeleton|sites-skeleton-shell/i);
  assert.doesNotMatch(html, /inviteToken|sessionToken|tokenHash/i);
});

test("익명 사용자는 주간 API의 이름과 체크 현황을 볼 수 없다", async () => {
  const response = await request("/api/week", {
    headers: { accept: "application/json" },
  });
  if (response.status !== 401 && response.status !== 403) {
    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  assert.ok(
    response.status === 401 || response.status === 403,
    `Expected 401 or 403, received ${response.status}.\n${serverOutput.slice(-2_000)}`,
  );

  const body = await response.text();
  assert.doesNotMatch(body, /"participants"|"completions"/i);
  assert.doesNotMatch(body, /inviteToken|sessionToken|tokenHash/i);
});

test("공용 링크에서 이름을 선택하고 바꿀 수 있다", async () => {
  const directory = await request("/api/session", {
    headers: { accept: "application/json" },
  });
  assert.equal(directory.status, 200);
  const directoryPayload = await directory.json();
  assert.equal(directoryPayload.authenticated, false);
  assert.equal(directoryPayload.participants.length, 13);
  assert.deepEqual(
    directoryPayload.participants.map((participant) => participant.id),
    Array.from({ length: 13 }, (_, index) => `p${String(index + 1).padStart(2, "0")}`),
  );
  assert.equal(
    new Set(directoryPayload.participants.map((participant) => participant.name)).size,
    13,
  );
  assert.ok(
    directoryPayload.participants.every(
      (participant) =>
        Object.keys(participant).sort().join(",") === "id,name,sortOrder",
    ),
  );

  const missingOrigin = await request("/api/session", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ participantId: "p02" }),
  });
  assert.equal(missingOrigin.status, 403);

  const missingParticipant = await request("/api/session", {
    method: "POST",
    headers: { origin, "content-type": "application/json" },
    body: JSON.stringify({ participantId: "missing" }),
  });
  assert.equal(missingParticipant.status, 404);

  let selection;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    selection = await request("/api/session", {
      method: "POST",
      headers: { origin, "content-type": "application/json" },
      body: JSON.stringify({ participantId: "p02" }),
    });
    if (selection.status !== 503) break;
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  assert.ok(selection);
  const selectionBody = await selection.clone().text();
  assert.equal(
    selection.status,
    200,
    `Selection failed: ${selectionBody}\n${serverOutput.slice(-2_000)}`,
  );
  const selectionCookies = selection.headers.get("set-cookie") ?? "";
  assert.match(selectionCookies, /wordgarden_member=p02/u);
  assert.match(selectionCookies, /wordgarden_session=;/u);
  assert.match(selectionCookies, /HttpOnly/iu);
  assert.match(selectionCookies, /SameSite=Lax/iu);
  assert.match(selectionCookies, /Path=\//iu);
  assert.match(selectionCookies, /08 Sep 2026 15:00:00 GMT/iu);
  const selectionPayload = await selection.json();
  assert.equal(selectionPayload.viewer.participantId, "p02");
  assert.ok(selectionPayload.redirectPath === "/" || selectionPayload.redirectPath === "/consent");

  const memberCookie = "wordgarden_member=p02";
  const beforeConsent = await request("/api/week", {
    headers: { cookie: memberCookie, accept: "application/json" },
  });
  assert.ok(beforeConsent.status === 200 || beforeConsent.status === 403);

  if (beforeConsent.status === 403) {
    const consent = await request("/api/consent", {
      method: "POST",
      headers: {
        cookie: memberCookie,
        origin,
        "content-type": "application/json",
      },
      body: JSON.stringify({ accepted: true }),
    });
    assert.equal(consent.status, 200);
  }

  const week = await request("/api/week", {
    headers: { cookie: memberCookie, accept: "application/json" },
  });
  assert.equal(week.status, 200);
  const weekPayload = await week.json();
  assert.equal(weekPayload.currentUser.id, "p02");
  assert.equal(weekPayload.participants.length, 13);
  assert.equal(weekPayload.days.length, 14);
  assert.deepEqual(
    weekPayload.days.map((day) => day.date),
    Array.from({ length: 14 }, (_, index) => {
      const date = new Date(Date.UTC(2026, 6, 27 + index));
      return date.toISOString().slice(0, 10);
    }),
  );
  assert.equal(weekPayload.weeks.length, 2);
  assert.ok(
    weekPayload.weeks.every(
      (week) => week.dayIds.length === 7 && week.garden.totalCount === 56,
    ),
  );
  assert.ok([1, 2].includes(weekPayload.activeWeekNumber));
  assert.equal(weekPayload.contentVariants.length, 98);
  const builtInBibles = weekPayload.contentVariants.filter(
    (variant) =>
      variant.mode === "embedded" &&
      variant.kind === "bible" &&
      variant.key === "krv",
  );
  const builtInCommentaries = weekPayload.contentVariants.filter(
    (variant) =>
      variant.mode === "embedded" &&
      variant.kind === "commentary" &&
      variant.key === "wordgarden",
  );
  assert.equal(builtInBibles.length, 14);
  assert.equal(builtInCommentaries.length, 14);
  assert.ok(
    builtInBibles.every(
      (variant) =>
        variant.copyAllowed === true &&
        variant.maxCopyVerses === 1 &&
        variant.rightsBasis === "public_domain" &&
        Array.isArray(variant.body?.verses),
    ),
  );
  assert.ok(
    builtInCommentaries.every(
      (variant) =>
        variant.copyAllowed === false &&
        variant.rightsBasis === "owned" &&
        Array.isArray(variant.body?.paragraphs),
    ),
  );
  assert.ok(
    weekPayload.contentVariants
      .filter((variant) => variant.mode === "external")
      .every((variant) => variant.body === null),
  );

  const adminAttempt = await request("/api/admin/audit", {
    headers: { cookie: memberCookie, accept: "application/json" },
  });
  assert.equal(adminAttempt.status, 403);

  for (const forgedId of ["admin", "missing"]) {
    const forged = await request("/api/week", {
      headers: { cookie: `wordgarden_member=${forgedId}`, accept: "application/json" },
    });
    assert.equal(forged.status, 401);
  }

  const cleared = await request("/api/session", {
    method: "DELETE",
    headers: { cookie: memberCookie, origin },
  });
  assert.equal(cleared.status, 200);
  const clearedCookies = cleared.headers.get("set-cookie") ?? "";
  assert.match(clearedCookies, /wordgarden_member=;/u);
  assert.match(clearedCookies, /wordgarden_session=;/u);
});
