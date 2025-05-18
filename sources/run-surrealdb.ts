import { RecordId, Surreal, Table } from "surrealdb";
import { surrealdbWasmEngines } from "@surrealdb/wasm";

const db = new Surreal({
  engines: surrealdbWasmEngines(),
});

await db.connect("mem://");

await db.use({
  namespace: "test",
  database: "test",
});

let created = await db.create("person", {
  title: "Founder & CEO",
  name: {
    first: "Tobie",
    last: "Morgan Hitchcock",
  },
  marketing: true,
});
console.log(created);

let updated = await db.merge(new RecordId("person", "jaime"), {
  marketing: true,
});
console.log(updated);

let people = await db.select("person");
console.log(people);

let groups = await db.query("SELECT marketing, count() FROM $tb GROUP BY marketing", {
  tb: new Table("person"),
});
console.log(groups);
