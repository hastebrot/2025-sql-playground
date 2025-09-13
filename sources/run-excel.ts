import readXlsxFile from "read-excel-file";

const data = await readXlsxFile(Bun.file("./data/2023-02-01.xlsx"));

console.log(data);
