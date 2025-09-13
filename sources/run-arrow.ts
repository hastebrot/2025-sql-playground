import { tableFromIPC } from "@uwdata/flechette";

// https://github.com/hyparam/hyparquet
// https://github.com/hyparam/hyparquet-compressors
// https://github.com/hyparam/hyparquet-writer
// https://github.com/hyparam/hysnappy
// https://github.com/catamphetamine/read-excel-file
// https://github.com/catamphetamine/write-excel-file

// hyparquet = 9.7 kb (min.gz)
// flechette = 14 kb (min.gz)
// https://github.com/leeoniya/uDSV?tab=readme-ov-file#performance
// https://github.com/d3/d3-dsv
// https://github.com/uwdata/arquero

const url = "https://cdn.jsdelivr.net/npm/vega-datasets@2/data/flights-200k.arrow";
const arrayBuffer = await fetch(url).then((r) => r.arrayBuffer());
Bun.write("data/flights-200k.arrow", new Uint8Array(arrayBuffer));

const startTime = performance.now();
const table = tableFromIPC(arrayBuffer);
console.log(`Loaded table in ${performance.now() - startTime}ms`);

// print table size: (231083 x 3)
console.log(`${table.numRows} x ${table.numCols}`);

{
  const startTime = performance.now();
  const objects = table.toArray();
  console.log(objects.length, Array.from(objects).length);
  console.log(`in ${performance.now() - startTime}ms`);
}

{
  const startTime = performance.now();
  const delayColumn = table.getChild("delay").toArray();
  let minValue = Infinity;
  for (const row of delayColumn) {
    if (row < minValue) {
      minValue = row;
    }
  }
  console.log(minValue)
  console.log(`in ${performance.now() - startTime}ms`);
}

// inspect schema for column names, data types, etc.
// [
//   { name: "delay", type: { typeId: 2, bitWidth: 16, signed: true }, ...},
//   { name: "distance", type: { typeId: 2, bitWidth: 16, signed: true }, ...},
//   { name: "time", type: { typeId: 3, precision: 1 }, ...}
// ]
// typeId: 2 === Type.Int, typeId: 3 === Type.Float
console.log(JSON.stringify(table.schema.fields, null, 2));

// convert a single Arrow column to a value array
// when possible, zero-copy access to binary data is used
const delay = table.getChild("delay").toArray();

// data columns are iterable
const time = [...table.getChild("time")];

// data columns provide random access
const time0 = table.getChild("time").at(0);

// extract all columns into a { name: array, ... } object
// { delay: Int16Array, distance: Int16Array, time: Float32Array }
const columns = table.toColumns();

// convert Arrow data to an array of standard JS objects
// [ { delay: 14, distance: 405, time: 0.01666666753590107 }, ... ]
const objects = table.toArray();

// create a new table with a selected subset of columns
// use this first to limit toColumns or toArray to fewer columns
const subtable = table.select(["delay", "time"]);
