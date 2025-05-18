# 2025-sql-playground

**usage:**

- `❯ cd sources/`
- `❯ bun install`
- `❯ bun run run-bunsql.ts`
- `❯ bun run run-postgresjs.ts`

**references:**

- `Bun.sql` tracking issue, https://github.com/oven-sh/bun/issues/15088
  - zig code, https://github.com/oven-sh/bun/tree/bun-v1.2.1/src/sql
  - ts code, https://github.com/oven-sh/bun/blob/bun-v1.2.1/src/js/bun/sql.ts
  - ts test code, https://github.com/oven-sh/bun/blob/bun-v1.2.1/test/js/sql/sql.test.ts
- Postgres.js repo, https://github.com/porsager/postgres
- Drizzle repo, https://github.com/drizzle-team/drizzle-orm

---

- `❯ bun add -D @electric-sql/pglite`
- `❯ bun add -D sqlocal`
- `❯ bun add -D wa-sqlite`

---

- `❯ bun add -D surrealdb @surrealdb/wasm`
- https://github.com/surrealdb/surrealdb.js
- https://github.com/surrealdb/surrealdb.wasm
> It enables SurrealDB to be run in-memory, or to persist data by running on top of IndexedDB. It allows for a consistent JavaScript and TypeScript API when using the surrealdb.js library by adding support for embedded storage engines (memory, indxdb) alongside the remote connection protocols (http, https, ws, wss).
- `❯ ls -lah node_modules/@surrealdb/wasm/dist/surreal/*.wasm`
- `❯ bun run run-surrealdb.ts`

---

- https://github.com/duckdb/duckdb-wasm/tree/main/packages/duckdb-wasm
- `❯ bun add -D @duckdb/duckdb-wasm`
- `❯ ls -lah node_modules/@duckdb/duckdb-wasm/dist/*.wasm`
