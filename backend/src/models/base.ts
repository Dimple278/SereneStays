/* The `BaseModel` class provides a static method `queryBuilder` that returns the connection to the
database using Knex. */
import { Knex } from "knex";
import db from "../database/db";
export class BaseModel {
  static connection: Knex = db;
  static queryBuilder() {
    return this.connection;
  }
}
