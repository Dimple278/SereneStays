import { Knex } from "knex";

const TABLE_NAME = "users";

/**
 * Create table users.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(TABLE_NAME, (table) => {
    table.increments("id").primary();
    table.string("email").notNullable().unique();
    table.string("f_name").notNullable();
    table.string("l_name").nullable();
    table.string("password").notNullable();
    table.string("provider_id").nullable();
    table.string("provider").nullable();
    table.json("image").nullable();
    table.timestamp("createdAt").defaultTo(knex.fn.now());
    table.timestamp("updatedAt").defaultTo(knex.fn.now());

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
  });
}

/**
 * Drop table users.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(TABLE_NAME);
}
