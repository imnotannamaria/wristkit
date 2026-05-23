import { type PostgresJsDatabase, drizzle } from "drizzle-orm/postgres-js";
import postgres, { type Sql } from "postgres";

import * as schema from "./schema";

export type RegistryDb = {
  db: PostgresJsDatabase<typeof schema>;
  sql: Sql;
  close: () => Promise<void>;
};

/**
 * One process, one client. The Shortcut posts once a day, but on Vercel
 * a warm function can serve many requests in a row and we do not want to
 * open + close a connection for each. Use a Supabase pooler URL in prod.
 */
let cached: { url: string; entry: RegistryDb } | null = null;

export function createDb(url: string): RegistryDb {
  if (cached && cached.url === url) return cached.entry;

  const sql = postgres(url, { prepare: false });
  const db = drizzle(sql, { schema });
  const entry: RegistryDb = {
    db,
    sql,
    close: async () => {
      // No-op: the client is shared across requests for the process lifetime.
      // The runtime tears it down when the function instance is recycled.
    },
  };
  cached = { url, entry };
  return entry;
}
