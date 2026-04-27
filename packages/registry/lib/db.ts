import { type PostgresJsDatabase, drizzle } from "drizzle-orm/postgres-js";
import postgres, { type Sql } from "postgres";

import * as schema from "./schema";

export type RegistryDb = {
  db: PostgresJsDatabase<typeof schema>;
  sql: Sql;
  close: () => Promise<void>;
};

export function createDb(url: string): RegistryDb {
  const sql = postgres(url, { prepare: false });
  const db = drizzle(sql, { schema });
  return {
    db,
    sql,
    close: async () => {
      await sql.end({ timeout: 5 });
    },
  };
}
