import { PGlite } from "@electric-sql/pglite";

if (import.meta.main) {
  const db = new PGlite();
  const res = await db.query("select 'Hello world' as message;");

  console.log(res.rows);
}
