import * as duckdb from "@duckdb/duckdb-wasm";
import * as arrow from "apache-arrow";
import path from "path";
import module from "module";

if (import.meta.main) {
  const require = module.createRequire(import.meta.url);
  const Worker = require("web-worker");
  const DUCKDB_DIST = path.dirname(require.resolve("@duckdb/duckdb-wasm"));
  const DUCKDB_CONFIG = await duckdb.selectBundle({
    mvp: {
      mainModule: path.resolve(DUCKDB_DIST, "./duckdb-mvp.wasm"),
      mainWorker: path.resolve(DUCKDB_DIST, "./duckdb-node-mvp.worker.cjs"),
    },
    eh: {
      mainModule: path.resolve(DUCKDB_DIST, "./duckdb-eh.wasm"),
      mainWorker: path.resolve(DUCKDB_DIST, "./duckdb-node-eh.worker.cjs"),
    },
  });

  const logger = new duckdb.ConsoleLogger();
  const worker = new Worker(DUCKDB_CONFIG.mainWorker);
  const db = new duckdb.AsyncDuckDB(logger, worker);
  await db.instantiate(DUCKDB_CONFIG.mainModule, DUCKDB_CONFIG.pthreadWorker);

  const conn = await db.connect();
  await conn.query<{ v: arrow.Int }>(
    `SELECT count(*)::INTEGER as v FROM generate_series(0, 100) t(v)`
  );

  await conn.close();
  await db.terminate();
  await worker.terminate();
}
