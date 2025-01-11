# 2025-sql-playground

**usage:**

- `❯ bun upgrade --canary`
- `❯ bun --version` outputs `1.1.44`
- `❯ cd sources/`
- `❯ bun install`
- `❯ bun run run-bunsql.ts`
- `❯ bun run run-postgresjs.ts`

**references:**

- `Bun.sql` tracking issue, https://github.com/oven-sh/bun/issues/15088
  - zig code, https://github.com/oven-sh/bun/tree/bun-v1.1.43/src/sql
  - ts code, https://github.com/oven-sh/bun/blob/bun-v1.1.43/src/js/bun/sql.ts
  - ts test code, https://github.com/oven-sh/bun/blob/bun-v1.1.43/test/js/sql/sql.test.ts
- Postgres.js repo, https://github.com/porsager/postgres
- Drizzle repo, https://github.com/drizzle-team/drizzle-orm
