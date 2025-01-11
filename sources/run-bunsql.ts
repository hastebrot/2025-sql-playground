import { postgres } from "bun:sql";

const sql = postgres("postgres://postgres@localhost:5432");
const res = await sql`select 1 as x`;
console.log(res);

await sql.close();
