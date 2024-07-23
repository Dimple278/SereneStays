import { Knex } from "knex";

const TABLE_NAME = "bookings";

/**
 * Create table BOOKINGS.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(TABLE_NAME, (table) => {
    table.bigIncrements("id").primary();

    table
      .bigInteger("user_id")
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

    table.date("start_date").notNullable();
    table.date("end_date").notNullable();

    table.decimal("total_price", 10, 2).notNullable();

    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
}

/**
 * Drop table BOOKINGS.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(TABLE_NAME);
}
