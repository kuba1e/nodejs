import { ObjectType } from "typeorm";
import { AppDataSource } from "../data-source";

export const excludeColumns = <Entity>(
  entity: ObjectType<Entity>,
  columnsToExclude: string[]
): string[] =>
  AppDataSource.getRepository(entity)
    .metadata.columns.map((column) => column.databaseName)
    .filter((columnName) => !columnsToExclude.includes(columnName));
