import {
  canCompleteDay,
  getCampaignPhase as getDomainCampaignPhase,
  getKstDateKey,
} from "@/lib/domain/campaign-clock";

export const toKstDate = getKstDateKey;

export type CampaignPhase = "upcoming" | "active" | "archive" | "deleted";

export function getCampaignPhase(now = new Date()): CampaignPhase {
  const phase = getDomainCampaignPhase(now);
  if (phase === "preview") return "upcoming";
  if (phase === "readOnly") return "archive";
  if (phase === "purgeDue") return "deleted";
  return "active";
}

export function canWriteCompletion(dayDate: string, now = new Date()) {
  return canCompleteDay(dayDate, now);
}
