import { env } from "cloudflare:workers";

export type SeedParticipant = {
  id: string;
  name: string;
  sortOrder: number;
  inviteTokenHash: string;
};

export type WordGardenSeed = {
  participants: SeedParticipant[];
  admin: { id: "admin"; tokenHash: string };
};

let cachedSeedRaw: string | null = null;
let cachedSeed: WordGardenSeed | null = null;

export function getWordGardenSeed() {
  const raw = readSecret("WORD_GARDEN_SEED_JSON");
  if (cachedSeed && cachedSeedRaw === raw) return cachedSeed;

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw) as unknown;
  } catch {
    throw new Error("WORD_GARDEN_SEED_JSON must be valid JSON");
  }
  const seed = validateSeed(parsed);
  cachedSeedRaw = raw;
  cachedSeed = seed;
  return seed;
}

export function getPurgeSecret() {
  const secret = readSecret("WORD_GARDEN_PURGE_SECRET");
  if (!/^[A-Za-z0-9_-]{43,128}$/u.test(secret)) {
    throw new Error("WORD_GARDEN_PURGE_SECRET is invalid");
  }
  return secret;
}

function readSecret(name: string) {
  const value = (env as unknown as Record<string, unknown>)[name];
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`${name} is unavailable`);
  }
  return value;
}

function validateSeed(value: unknown): WordGardenSeed {
  if (typeof value !== "object" || value === null) {
    throw new Error("WORD_GARDEN_SEED_JSON must be an object");
  }
  const participantsValue = Reflect.get(value, "participants");
  const adminValue = Reflect.get(value, "admin");
  if (!Array.isArray(participantsValue) || participantsValue.length !== 13) {
    throw new Error("WORD_GARDEN_SEED_JSON must contain exactly 13 participants");
  }

  const ids = new Set<string>();
  const names = new Set<string>();
  const orders = new Set<number>();
  const hashes = new Set<string>();
  const participants = participantsValue.map((item, index) => {
    if (typeof item !== "object" || item === null) {
      throw new Error("Invalid participant seed");
    }
    const id = Reflect.get(item, "id");
    const name = Reflect.get(item, "name");
    const sortOrder = Reflect.get(item, "sortOrder");
    const inviteTokenHash = Reflect.get(item, "inviteTokenHash");
    if (
      id !== `p${String(index + 1).padStart(2, "0")}` ||
      typeof name !== "string" ||
      name.trim().length < 1 ||
      name.trim().length > 50 ||
      sortOrder !== index + 1 ||
      typeof inviteTokenHash !== "string" ||
      !/^[a-f0-9]{64}$/u.test(inviteTokenHash)
    ) {
      throw new Error("Invalid participant seed");
    }
    if (
      ids.has(id) ||
      names.has(name.trim()) ||
      orders.has(sortOrder) ||
      hashes.has(inviteTokenHash)
    ) {
      throw new Error("Duplicate participant seed value");
    }
    ids.add(id);
    names.add(name.trim());
    orders.add(sortOrder);
    hashes.add(inviteTokenHash);
    return { id, name: name.trim(), sortOrder, inviteTokenHash };
  });

  if (typeof adminValue !== "object" || adminValue === null) {
    throw new Error("Invalid admin seed");
  }
  const adminId = Reflect.get(adminValue, "id");
  const adminTokenHash = Reflect.get(adminValue, "tokenHash");
  if (
    adminId !== "admin" ||
    typeof adminTokenHash !== "string" ||
    !/^[a-f0-9]{64}$/u.test(adminTokenHash) ||
    hashes.has(adminTokenHash)
  ) {
    throw new Error("Invalid admin seed");
  }

  return {
    participants,
    admin: { id: "admin", tokenHash: adminTokenHash },
  };
}
