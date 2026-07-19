import { and, asc, eq, isNull } from "drizzle-orm";
import { getDb } from "@/db";
import { adminCredentials, participants, sessions } from "@/db/schema";
import {
  CAMPAIGN_ID,
  MEMBER_COOKIE_NAME,
  SESSION_COOKIE_NAME,
  SESSION_EXPIRES_AT,
} from "./constants";
import { randomToken, sha256 } from "./crypto";
import { purgePersonalDataIfDue } from "./database";
import { ApiError } from "./response";

export type MemberViewer = {
  role: "member";
  campaignId: string;
  participantId: string;
  name: string;
  consentedAt: string | null;
};

export type AdminViewer = {
  role: "admin";
  campaignId: string;
  participantId: null;
  name: "운영자";
  consentedAt: null;
};

export type Viewer = MemberViewer | AdminViewer;

export async function listGroupParticipants() {
  await purgePersonalDataIfDue();
  return getDb()
    .select({
      id: participants.id,
      name: participants.name,
      sortOrder: participants.sortOrder,
    })
    .from(participants)
    .where(
      and(
        eq(participants.campaignId, CAMPAIGN_ID),
        eq(participants.active, true),
      ),
    )
    .orderBy(asc(participants.sortOrder));
}

export async function selectGroupParticipant(participantId: string) {
  await purgePersonalDataIfDue();
  const participant = await findActiveParticipant(participantId);
  if (!participant) return null;
  return {
    cookieValue: participant.id,
    viewer: memberViewer(participant),
  };
}

export async function exchangeInviteToken(rawToken: string) {
  await purgePersonalDataIfDue();
  const tokenHash = await sha256(rawToken);
  const db = getDb();

  const [participant] = await db
    .select({
      id: participants.id,
      campaignId: participants.campaignId,
      name: participants.name,
      consentedAt: participants.consentedAt,
    })
    .from(participants)
    .where(
      and(
        eq(participants.campaignId, CAMPAIGN_ID),
        eq(participants.inviteTokenHash, tokenHash),
        eq(participants.active, true),
      ),
    )
    .limit(1);

  if (participant) {
    const sessionToken = await createSession(
      participant.campaignId,
      participant.id,
      "member",
    );
    return {
      sessionToken,
      redirectPath: participant.consentedAt ? "/day/2026-07-27" : "/consent",
      viewer: {
        role: "member" as const,
        campaignId: participant.campaignId,
        participantId: participant.id,
        name: participant.name,
        consentedAt: participant.consentedAt,
      },
    };
  }

  const [admin] = await db
    .select({ campaignId: adminCredentials.campaignId })
    .from(adminCredentials)
    .where(
      and(
        eq(adminCredentials.campaignId, CAMPAIGN_ID),
        eq(adminCredentials.tokenHash, tokenHash),
        eq(adminCredentials.active, true),
      ),
    )
    .limit(1);

  if (!admin) return null;

  return {
    sessionToken: await createSession(admin.campaignId, null, "admin"),
    redirectPath: "/admin",
    viewer: {
      role: "admin" as const,
      campaignId: admin.campaignId,
      participantId: null,
      name: "운영자" as const,
      consentedAt: null,
    },
  };
}

async function createSession(
  campaignId: string,
  participantId: string | null,
  role: "member" | "admin",
) {
  const rawToken = randomToken();
  const tokenHash = await sha256(rawToken);
  await getDb().insert(sessions).values({
    tokenHash,
    campaignId,
    participantId,
    role,
    expiresAt: SESSION_EXPIRES_AT,
  });
  return rawToken;
}

export async function getViewer(request: Request): Promise<Viewer | null> {
  await purgePersonalDataIfDue();
  const rawToken = readCookie(request.headers.get("cookie"), SESSION_COOKIE_NAME);
  if (rawToken) {
    const tokenHash = await sha256(rawToken);
    const now = new Date().toISOString();
    const db = getDb();
    const [session] = await db
      .select({
        campaignId: sessions.campaignId,
        participantId: sessions.participantId,
        role: sessions.role,
        expiresAt: sessions.expiresAt,
      })
      .from(sessions)
      .where(
        and(
          eq(sessions.tokenHash, tokenHash),
          isNull(sessions.revokedAt),
        ),
      )
      .limit(1);

    if (session && session.expiresAt > now && session.campaignId === CAMPAIGN_ID) {
      if (session.role === "admin" && !session.participantId) {
        const [credential] = await db
          .select({ id: adminCredentials.id })
          .from(adminCredentials)
          .where(
            and(
              eq(adminCredentials.id, "admin"),
              eq(adminCredentials.campaignId, session.campaignId),
              eq(adminCredentials.active, true),
            ),
          )
          .limit(1);
        if (credential) {
          return {
            role: "admin",
            campaignId: session.campaignId,
            participantId: null,
            name: "운영자",
            consentedAt: null,
          };
        }
      }

      if (session.role === "member" && session.participantId) {
        const participant = await findActiveParticipant(session.participantId);
        if (participant) return memberViewer(participant);
      }
    }
  }

  const selectedParticipantId = readCookie(
    request.headers.get("cookie"),
    MEMBER_COOKIE_NAME,
  );
  if (!selectedParticipantId) return null;
  const selectedParticipant = await findActiveParticipant(selectedParticipantId);
  return selectedParticipant ? memberViewer(selectedParticipant) : null;
}

export async function requireMember(request: Request, requireConsent = true) {
  const viewer = await getViewer(request);
  if (!viewer) {
    throw new ApiError(401, "AUTH_REQUIRED", "첫 화면에서 내 이름을 선택해 주세요.");
  }
  if (viewer.role !== "member") {
    throw new ApiError(403, "MEMBER_REQUIRED", "참여자 전용 기능입니다.");
  }
  if (requireConsent && !viewer.consentedAt) {
    throw new ApiError(
      403,
      "CONSENT_REQUIRED",
      "이름과 읽음 상태 공유에 먼저 동의해 주세요.",
    );
  }
  return viewer;
}

async function findActiveParticipant(participantId: string) {
  const [participant] = await getDb()
    .select({
      id: participants.id,
      campaignId: participants.campaignId,
      name: participants.name,
      consentedAt: participants.consentedAt,
    })
    .from(participants)
    .where(
      and(
        eq(participants.id, participantId),
        eq(participants.campaignId, CAMPAIGN_ID),
        eq(participants.active, true),
      ),
    )
    .limit(1);
  return participant ?? null;
}

function memberViewer(participant: {
  id: string;
  campaignId: string;
  name: string;
  consentedAt: string | null;
}): MemberViewer {
  return {
    role: "member",
    campaignId: participant.campaignId,
    participantId: participant.id,
    name: participant.name,
    consentedAt: participant.consentedAt,
  };
}

export async function requireAdmin(request: Request) {
  const viewer = await getViewer(request);
  if (!viewer) {
    throw new ApiError(401, "AUTH_REQUIRED", "운영자 초대 링크로 접속해 주세요.");
  }
  if (viewer.role !== "admin") {
    throw new ApiError(403, "ADMIN_REQUIRED", "운영자 권한이 필요합니다.");
  }
  return viewer;
}

function readCookie(header: string | null, name: string) {
  if (!header) return null;
  for (const part of header.split(";")) {
    const separator = part.indexOf("=");
    if (separator < 0) continue;
    if (part.slice(0, separator).trim() !== name) continue;
    const value = part.slice(separator + 1).trim();
    try {
      return decodeURIComponent(value);
    } catch {
      return null;
    }
  }
  return null;
}
