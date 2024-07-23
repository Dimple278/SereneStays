import { Knex } from "knex";

const TABLE_NAME = "reviews";

/**
 * Create table reviews.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(TABLE_NAME, (table) => {
    table.bigIncrements("id").primary();

    table.text("comment").notNullable();
    table.integer("rating").notNullable();

    table.timestamp("created_at").notNullable().defaultTo(knex.raw("now()"));
    table.timestamp("updated_at").nullable().defaultTo(null);

    table
      .bigInteger("author_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");

    table
      .bigInteger("listing_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("listings")
      .onDelete("CASCADE");
  });
}

/**
 * Drop table reviews.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(TABLE_NAME);
}
