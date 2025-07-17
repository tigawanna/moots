import type { ColumnDataType } from "drizzle-orm";
import {
    type AnySQLiteSelectQueryBuilder,
  QueryBuilder,
  SQLiteCustomColumn,
  SQLiteSyncDialect,
  customType,
  SQLiteColumn,
  sqliteTable,
  type SQLiteTableWithColumns,
} from "drizzle-orm/sqlite-core";

import type { Store } from "@livestore/livestore";
import { Schema, SqliteDsl, State } from "@livestore/livestore";

import { Option, pipe, Record } from "effect";

export const query = <Built extends Pick<AnySQLiteSelectQueryBuilder, "_" | "toSQL">>(
  store: Store<any, any>,
  build: (qb: QueryBuilder) => Built
): Built["_"]["result"] => {
  const built = build(new QueryBuilder(new SQLiteSyncDialect()));
  const { sql, params } = built.toSQL();
  const rows = store.query({
    query: sql,
    bindValues: params as never,
  }) as unknown[];
  return rows.map((row) =>
    Record.map(built._.selectedFields, (col_, key) => {
      const col = col_ as SQLiteCustomColumn<any>;
      return col.mapFromDriverValue((row as never)[key]);
    })
  );
};

export const toDrizzleTables = <TA extends Record<string, State.SQLite.TableDef.Any>>(
  tables: TA
): {
  [K in keyof TA]: ToDrizzleTable<TA[K]["sqliteDef"]>;
} =>
  Record.map(tables, (def) => (def.sqliteDef ? toDrizzleTable(def.sqliteDef) : undefined)) as never;

type LivestoreTable = SqliteDsl.TableDefinition<string, SqliteDsl.Columns>;

const toDrizzleTable = (def: LivestoreTable) =>
  sqliteTable(
    def.name,
    Record.map(def.columns, (col) =>
      pipe(
        toDrizzleType(col),
        (_) => (col.primaryKey ? _.primaryKey() : !col.nullable ? _.notNull() : _),
        (_) => (Option.isSome(col.default) ? _.default(col.default.value) : _)
      )
    )
  );

const toDrizzleType = ({ columnType, schema }: SqliteDsl.ColumnDefinition<any, any>) => {
  return customType({
    dataType: () => columnType,
    toDriver: Schema.encodeSync(schema),
    fromDriver: Schema.decodeSync(schema),
  })();
};

type ToDrizzleTable<T extends LivestoreTable> = SQLiteTableWithColumns<{
  name: T["name"];
  schema: undefined; // TODO: confirm
  columns: {
    [K in keyof T["columns"]]: T["columns"][K] extends infer Column extends SqliteDsl.ColumnDefinition<
      any,
      any
    >
      ? SQLiteColumn<
          {
            name: Extract<K, string>;
            tableName: T["name"];
            dataType: ColumnDataType;
            columnType: Column["columnType"];
            data: Schema.Schema.Type<Column["schema"]>;
            driverParam: Schema.Schema.Encoded<Column["schema"]>;
            notNull: Column["nullable"] extends false ? true : false;
            hasDefault: Column["default"] extends Option.Some<any> ? true : false;
            isPrimaryKey: Column["primaryKey"];
            isAutoincrement: false;
            hasRuntimeDefault: Column["default"] extends Option.Some<any> ? true : false;
            enumValues: undefined;
          },
          {},
          {}
        >
      : never;
  };
  dialect: "sqlite";
}>;
