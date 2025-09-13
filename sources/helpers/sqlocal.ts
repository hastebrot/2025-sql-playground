import { Kysely } from "kysely";
import { defaultDeserializer, defaultSerializer, SerializePlugin } from "kysely-plugin-serialize";
import { SQLocalKysely } from "sqlocal/kysely";

export const createDatabaseWithSqlocal = <KyselyDatabase = unknown>(
  sqlocalConfig: SQLocalKysely["config"],
) => {
  const { dialect, deleteDatabaseFile, getDatabaseFile } = new SQLocalKysely(sqlocalConfig);
  const db = new Kysely<KyselyDatabase>({
    dialect,
    plugins: [
      // serialize plugin should be placed at the end of the plugins array.
      new SerializePlugin({
        serializer: defaultSerializer,
        deserializer: defaultDeserializer,
      }),
    ],
  });

  return { db, deleteDatabaseFile, getDatabaseFile };
};
