import {
  asyncBufferFromFile,
  parquetMetadataAsync,
  parquetReadObjects,
  parquetSchema,
  toJson,
} from "hyparquet";
import { compressors } from "hyparquet-compressors";
import { Fmt } from "./helpers/fmt.ts";
import { tableFromArrays, tableToIPC } from "@uwdata/flechette";
import { table, toArrowIPC, toCSV } from "arquero";
import { parquetWriteBuffer } from "hyparquet-writer";
import writeXlsxFile from "write-excel-file";
import readXlsxFile from "read-excel-file";
import { SQL } from "bun";
import { createDatabaseWithSqlocal } from "./helpers/sqlocal.ts";

// https://github.com/parquet-go/parquet-go
// https://github.com/qax-os/excelize
// https://github.com/thedatashed/xlsxreader

// import { Window } from "happy-dom";
// export const dom = new Window();
// export function registerGlobals() {
//   const ignoredKeys = ["undefined"];
//   for (const key in Object.getOwnPropertyDescriptors(dom)) {
//     // @ts-ignore
//     if (global[key] === undefined && !ignoredKeys.includes(key)) {
//       // @ts-ignore
//       global[key] = dom[key];
//     }
//   }
// }
// registerGlobals();

const startTime = performance.now();
const file = await asyncBufferFromFile("./data/flights-3m.parquet");
// const file = await Bun.file("./data/flights-3m.parquet").arrayBuffer();
const data = await parquetReadObjects({ file, compressors });
// console.log(data.length, data.slice(0, 1));
console.log("read parquet", Fmt.millis(performance.now() - startTime));

const columnData = {} as any;
for (const key in data[0]) {
  columnData[key] = [];
  for (const row of data) {
    columnData[key].push(row[key]);
  }
}

{
  const metadata = await parquetMetadataAsync(file);
  const numRows = Number(metadata.num_rows);
  const schema = parquetSchema(metadata);
  const columnNames = schema.children.map((e) => e.element.name);
  const columnTypes = schema.children.map((e) => e.element.type);
  console.log(numRows, columnNames, columnTypes);
}

// {
//   const startTime = performance.now();
//   const data = []
//   for (const key in columnData) {
//     data.push({
//       name: key,
//       data: columnData[key],
//     });
//   }
//   const arrayBuffer = parquetWriteBuffer({ columnData: data });
//   Bun.write("./data/flights-3m.new.parquet", arrayBuffer);
//   console.log("write parquet", Fmt.millis(performance.now() - startTime));
// }

{
  const startTime = performance.now();
  const json = toJson(data.slice(0, 10_000));
  // const json = toJson(data);
  const schema = [];
  for (const key in json[0]) {
    const value = json[0][key];
    const type =
      typeof value === "string"
        ? String
        : typeof value === "number"
        ? Number
        : typeof value === "boolean"
        ? Boolean
        : String;
    schema.push({
      column: key,
      type,
      value: (it: any) => it[key],
    });
  }
  const buffer = await writeXlsxFile(json, { schema });
  Bun.write("./data/flights-3m.xlsx", await buffer.arrayBuffer());
  // Bun.write("./data/flights-3m.xlsx.zip", await buffer.arrayBuffer());
  console.log("write excel", Fmt.millis(performance.now() - startTime));
}

{
  const startTime = performance.now();
  const setupDatabase = async <T extends any = any>() => {
    return createDatabaseWithSqlocal<T>({
      databasePath: ":memory:",
    });
  };
  const { db, getDatabaseFile } = await setupDatabase();
  await db.schema
    .createTable("flights")
    .addColumn("date", "text")
    .addColumn("delay", "numeric")
    .addColumn("distance", "numeric")
    .addColumn("origin", "text")
    .addColumn("destination", "text")
    .execute();
  for (const row of data.slice(0, 100_000)) {
    await db
      .insertInto("flights")
      .values({
        date: row.date,
        delay: row.delay,
        distance: row.distance,
        origin: row.origin,
        destination: row.destination,
      })
      .execute();
  }
  const file = await getDatabaseFile();
  await Bun.write("./data/flights-3m.sqlite", await file.arrayBuffer());
  console.log("write sqlite", Fmt.millis(performance.now() - startTime));

  // const startTime = performance.now();
  // const db = new SQL("sqlite://./data/flights-3m.sqlite");

  // await db`drop table if exists flights;`;
  // await db`create table flights
  // (date text, delay numeric, distance numeric, origin text, destination text);`;

  // let index = 0
  // for (const row of data.slice(0, 100_000)) {
  //   await db`insert into flights
  //   (date, delay, distance, origin, destination)
  //   values (${row.date}, ${row.delay}, ${row.distance}, ${row.origin}, ${row.destination});`;
  // }

  // console.log("write sqlite", Fmt.millis(performance.now() - startTime));
}

process.exit(0);

// {
//   const startTime = perf´®ormance.now();
//   const buffer = await Bun.file("./data/flights-3m.xlsx").arrayBuffer();
//   const data = await readXlsxFile(buffer);
//   console.log(data.length);
//   console.log("read excel", Fmt.millis(performance.now() - startTime));
// }

// process.exit(0);

// {
//   const startTime = performance.now();
//   Bun.write("./data/flights-3m.json", JSON.stringify(toJson(data)));
//   console.log("write json", Fmt.millis(performance.now() - startTime));
// }

{
  const startTime = performance.now();
  const dt = table(columnData);
  const csv = toCSV(dt, { header: true });
  Bun.write("./data/flights-3m.csv", csv);
  console.log("write csv", Fmt.millis(performance.now() - startTime));
}

{
  const startTime = performance.now();
  const dt = table(columnData);
  const arrow = toArrowIPC(dt, { format: "file" });
  Bun.write("./data/flights-3m.arrow", arrow);
  console.log("write arrow", Fmt.millis(performance.now() - startTime));
}

{
  const startTime = performance.now();
  const dt = tableFromArrays(columnData);
  const ipc = tableToIPC(dt, { format: "file" });
  if (ipc === null) throw new Error("ipc is null");
  // Bun.write("./data/flights-3m.arrow", ipc);
  console.log("write arrow", Fmt.millis(performance.now() - startTime));
}
