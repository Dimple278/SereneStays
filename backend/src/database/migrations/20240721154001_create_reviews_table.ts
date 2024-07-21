import { Knex } from "knex";

const TABLE_NAME = "reviews";

/**
 * Create table reviews.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable(TABLE_NAME, (table) => {
      table.increments("id").primary();
      table.text("comment");
      table.integer("rate").notNullable();
      table.timestamp("created_at").notNullable().defaultTo(knex.raw("now()"));

      table
        .bigInteger("created_by")
        .unsigned()
        .nullable()
        .references("id")
        .inTable(TABLE_NAME);

      table.timestamp("updated_at").nullable();

      table
        .bigInteger("updated_by")
        .unsigned()
        .references("id")
        .inTable(TABLE_NAME)
        .nullable();
    })
    .then(() => {
      return knex.schema.raw(`
      ALTER TABLE ${TABLE_NAME}
      ADD CONSTRAINT check_rate CHECK (rate >= 1 AND rate <= 5)
    `);
    });
}

/**
 * Drop table TABLE_NAME.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(TABLE_NAME);
}
