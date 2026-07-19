import assert from "node:assert/strict";
import fs from "node:fs";

const baseUrl = process.env.WORD_GARDEN_TEST_URL ?? "http://localhost:3000";
const tokenData = JSON.parse(
  fs.readFileSync(new URL("../outputs/invite-tokens.json", import.meta.url), "utf8"),
);
const siteSecrets = JSON.parse(
  fs.readFileSync(new URL("../outputs/site-secrets.json", import.meta.url), "utf8"),
);
const anonymous = await fetch(`${baseUrl}/api/week`);
assert.equal(anonymous.status, 401);

const directory = await fetch(`${baseUrl}/api/session`);
assert.equal(directory.status, 200);
const directoryPayload = await directory.json();
assert.equal(directoryPayload.participants.length, 13);
assert.ok(
  directoryPayload.participants.every(
    (participant) =>
      Object.keys(participant).sort().join(",") === "id,name,sortOrder",
  ),
);

const anonymousSharedWrite = await fetch(
  `${baseUrl}/api/completions/shared/p01/d1`,
  {
    method: "PUT",
    headers: {
      origin: baseUrl,
      "content-type": "application/json",
    },
    body: JSON.stringify({ completed: true }),
  },
);
assert.equal(anonymousSharedWrite.status, 401);

const missingOriginSelection = await fetch(`${baseUrl}/api/session`, {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ participantId: "p02" }),
});
assert.equal(missingOriginSelection.status, 403);

const selection = await fetch(`${baseUrl}/api/session`, {
  method: "POST",
  headers: {
    origin: baseUrl,
    "content-type": "application/json",
  },
  body: JSON.stringify({ participantId: "p02" }),
});
assert.equal(selection.status, 200);
const selectionCookies = selection.headers.get("set-cookie") ?? "";
assert.match(selectionCookies, /wordgarden_member=p02/u);
assert.match(selectionCookies, /wordgarden_session=;/u);
assert.match(selectionCookies, /HttpOnly/iu);
assert.match(selectionCookies, /SameSite=Lax/iu);
assert.match(selectionCookies, /Path=\//iu);
if (baseUrl.startsWith("https://")) assert.match(selectionCookies, /Secure/iu);
const cookie = "wordgarden_member=p02";

const beforeConsent = await fetch(`${baseUrl}/api/week`, { headers: { cookie } });
assert.ok(beforeConsent.status === 200 || beforeConsent.status === 403);

if (beforeConsent.status === 403) {
  const consent = await fetch(`${baseUrl}/api/consent`, {
    method: "POST",
    headers: {
      cookie,
      origin: baseUrl,
      "content-type": "application/json",
    },
    body: JSON.stringify({ accepted: true }),
  });
  assert.equal(consent.status, 200);
}

const authenticated = await fetch(`${baseUrl}/api/week`, { headers: { cookie } });
assert.equal(authenticated.status, 200);
const week = await authenticated.json();
assert.equal(week.participants.length, 13);
assert.equal(week.days.length, 14);
assert.deepEqual(
  week.days.map((day) => day.date),
  Array.from({ length: 14 }, (_, index) => {
    const date = new Date(Date.UTC(2026, 6, 27 + index));
    return date.toISOString().slice(0, 10);
  }),
);
assert.equal(week.weeks.length, 2);
assert.ok(
  week.weeks.every(
    (campaignWeek) =>
      campaignWeek.dayIds.length === 7 && campaignWeek.garden.totalCount === 56,
  ),
);
assert.ok(week.contentVariants.length >= 98);
const embeddedVariants = week.contentVariants.filter(
  (variant) => variant.mode === "embedded",
);
assert.equal(embeddedVariants.length, 28);
assert.equal(
  embeddedVariants.filter(
    (variant) =>
      variant.kind === "bible" &&
      variant.key === "krv" &&
      variant.copyAllowed === true &&
      variant.maxCopyVerses === 1 &&
      variant.rightsBasis === "public_domain" &&
      Array.isArray(variant.body?.verses),
  ).length,
  14,
);
assert.equal(
  embeddedVariants.filter(
    (variant) =>
      variant.kind === "commentary" &&
      variant.key === "wordgarden" &&
      variant.copyAllowed === false &&
      variant.rightsBasis === "owned" &&
      Array.isArray(variant.body?.paragraphs),
  ).length,
  14,
);
assert.ok(
  week.contentVariants
    .filter((variant) => variant.mode === "external")
    .every(
    (variant) => variant.mode === "external" && variant.body === null,
  ),
);
const writableDay = week.days.find((day) => day.canComplete) ?? null;
const probeDay = writableDay ?? week.days[0];
const targetParticipant = week.participants.find(
  (participant) => participant.id !== week.currentUser.id,
);
assert.ok(probeDay && targetParticipant);
const sharedWasCompleted = week.completions.some(
  (completion) =>
    completion.participantId === targetParticipant.id &&
    completion.dayId === probeDay.id,
);
const ownWasCompleted = week.completions.some(
  (completion) =>
    completion.participantId === week.currentUser.id &&
    completion.dayId === probeDay.id,
);

const adminAttempt = await fetch(`${baseUrl}/api/admin/audit`, { headers: { cookie } });
assert.equal(adminAttempt.status, 403);

const memberAdminWriteAttempt = await fetch(
  `${baseUrl}/api/admin/completions/p01/d1`,
  {
    method: "PUT",
    headers: {
      cookie,
      origin: baseUrl,
      "content-type": "application/json",
    },
    body: JSON.stringify({ completed: true }),
  },
);
assert.equal(memberAdminWriteAttempt.status, 403);

const sharedMissingOriginWrite = await fetch(
  `${baseUrl}/api/completions/shared/${targetParticipant.id}/${probeDay.id}`,
  {
    method: "PUT",
    headers: { cookie, "content-type": "application/json" },
    body: JSON.stringify({ completed: true }),
  },
);
assert.equal(sharedMissingOriginWrite.status, 403);

const sharedMissingParticipantWrite = await fetch(
  `${baseUrl}/api/completions/shared/missing/${probeDay.id}`,
  {
    method: "PUT",
    headers: {
      cookie,
      origin: baseUrl,
      "content-type": "application/json",
    },
    body: JSON.stringify({ completed: true }),
  },
);
assert.equal(sharedMissingParticipantWrite.status, 404);

const sharedWrite = await fetch(
  `${baseUrl}/api/completions/shared/${targetParticipant.id}/${probeDay.id}`,
  {
    method: "PUT",
    headers: {
      cookie,
      origin: baseUrl,
      "content-type": "application/json",
    },
    body: JSON.stringify({ completed: !sharedWasCompleted }),
  },
);
assert.equal(sharedWrite.status, writableDay ? 200 : 423);

if (writableDay) {
  const sharedRestore = await fetch(
    `${baseUrl}/api/completions/shared/${targetParticipant.id}/${probeDay.id}`,
    {
      method: "PUT",
      headers: {
        cookie,
        origin: baseUrl,
        "content-type": "application/json",
      },
      body: JSON.stringify({ completed: sharedWasCompleted }),
    },
  );
  assert.equal(sharedRestore.status, 200);
}

const missingOriginWrite = await fetch(`${baseUrl}/api/completions/${probeDay.id}`, {
  method: "PUT",
  headers: { cookie, "content-type": "application/json" },
  body: JSON.stringify({ completed: true }),
});
assert.equal(missingOriginWrite.status, 403);

const ownWrite = await fetch(`${baseUrl}/api/completions/${probeDay.id}`, {
  method: "PUT",
  headers: {
    cookie,
    origin: baseUrl,
    "content-type": "application/json",
  },
  body: JSON.stringify({ completed: !ownWasCompleted }),
});
assert.equal(ownWrite.status, writableDay ? 200 : 423);

if (writableDay) {
  const ownRestore = await fetch(`${baseUrl}/api/completions/${probeDay.id}`, {
    method: "PUT",
    headers: {
      cookie,
      origin: baseUrl,
      "content-type": "application/json",
    },
    body: JSON.stringify({ completed: ownWasCompleted }),
  });
  assert.equal(ownRestore.status, 200);
}

const adminInvite = await fetch(`${baseUrl}/invite/${tokenData.admin.token}`, {
  redirect: "manual",
});
assert.equal(adminInvite.status, 303);
assert.match(adminInvite.headers.get("location") ?? "", /\/admin$/u);
const adminCookie = (adminInvite.headers.get("set-cookie") ?? "").split(";")[0];
const adminWeek = await fetch(`${baseUrl}/api/week`, {
  headers: { cookie: adminCookie },
});
assert.equal(adminWeek.status, 200);
const adminPayload = await adminWeek.json();
assert.equal(adminPayload.currentUser.role, "admin");
const audit = await fetch(`${baseUrl}/api/admin/audit`, {
  headers: { cookie: adminCookie },
});
assert.equal(audit.status, 200);
const auditPayload = await audit.json();
if (writableDay) {
  const sharedAudit = auditPayload.audit.find(
    (entry) =>
      entry.action === "completion.shared_updated" &&
      entry.actorId === week.currentUser.id &&
      entry.targetId === `${targetParticipant.id}:${probeDay.id}`,
  );
  assert.ok(sharedAudit);
}

const purge = await fetch(`${baseUrl}/api/maintenance/purge`, {
  method: "POST",
  headers: {
    authorization: `Bearer ${siteSecrets.WORD_GARDEN_PURGE_SECRET}`,
  },
});
assert.equal(purge.status, 423);

process.stdout.write(
  JSON.stringify({
    anonymous: anonymous.status,
    anonymousSharedDenied: anonymousSharedWrite.status,
    selection: selection.status,
    selectionOriginDenied: missingOriginSelection.status,
    authenticated: authenticated.status,
    memberAdminDenied: adminAttempt.status,
    memberAdminWriteDenied: memberAdminWriteAttempt.status,
    sharedMissingOriginDenied: sharedMissingOriginWrite.status,
    sharedMissingParticipant: sharedMissingParticipantWrite.status,
    sharedWrite: sharedWrite.status,
    missingOriginDenied: missingOriginWrite.status,
    ownWrite: ownWrite.status,
    adminAuthenticated: adminWeek.status,
    audit: audit.status,
    preRetentionPurgeLocked: purge.status,
  }),
);
