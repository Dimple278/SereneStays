import toSnakeCase from "to-snake-case";
import { baseKnexConfig } from "./knexfile";
import knex, { Knex } from "knex";
import camelize from "camelize";

const KnexConfig: Knex.Config = {
  ...baseKnexConfig,
  wrapIdentifier: (value, originalImpl) => {
    if (value === "*") {
      return originalImpl(value);
    }
    return originalImpl(toSnakeCase(value));
  },
  postProcessResponse: (result) => {
    return camelize(result);
  },
};

const db = knex(KnexConfig);

export default db;
