declare namespace Cloudflare {
  interface Env {
    DB: D1Database;
    WORD_GARDEN_SEED_JSON: string;
    WORD_GARDEN_PURGE_SECRET: string;
  }
}
