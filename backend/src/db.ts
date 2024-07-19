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
  // what to do after the response is received
  postProcessResponse: (result) => {
    return camelize(result);
  },
};

const db = knex(KnexConfig);

// Test the database connection
// db.raw("SELECT 1")
//   .then(() => {
//     console.log("Connected to PostgreSQL database");
//   })
//   .catch((err) => {
//     console.error("Error connecting to PostgreSQL database:", err);
//   });

export default db;
