import { Knex } from "knex";

const TABLE_NAME = "listings";

/**
 * Create table listings.
 *
 * @param   {Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(TABLE_NAME, (table) => {
    table.increments("id").primary();
    table
      .bigInteger("owner_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users");
    table.string("title").notNullable();
    table.text("description").notNullable();
    table.string("location").notNullable();
    table.string("country").notNullable();
    table.decimal("price", 10, 2).notNullable();
    table.json("images").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
}

/**
 * Drop table listings.
 *
 * @param   {Knex} knex
 * @returns {Promise<void>}
 */
export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(TABLE_NAME);
}
