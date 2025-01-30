import { SQL } from "bun";

if (import.meta.main) {
  const sql = new SQL("postgres://postgres@localhost:5432");
  const res = await sql`select 1 as x`;
  console.log(res);

  await sql.close();
}

type NonEmptyArray<T> = [T, ...T[]];

const okay: NonEmptyArray<number> = [1, 2];
const alsoOkay: NonEmptyArray<number> = [1];
const err: NonEmptyArray<number> = []; // error!
