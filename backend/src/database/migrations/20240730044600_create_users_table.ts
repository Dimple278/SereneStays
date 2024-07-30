import { Knex } from "knex";

const TABLE_NAME = "users";

/**
 * Create table USERS.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(TABLE_NAME, (table) => {
    table.bigIncrements("id");
    table.string("email").notNullable().unique();
    table.string("password").notNullable();
    table.string("name").notNullable();
    table.enu("role", ["superadmin", "user"]).notNullable().defaultTo("user");
    table.string("image").nullable();
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    table.timestamp("updated_at").nullable();

    table
      .bigInteger("created_by")
      .unsigned()
      .nullable()
      .references("id")
      .inTable(TABLE_NAME);

    table
      .bigInteger("updated_by")
      .unsigned()
      .references("id")
      .inTable(TABLE_NAME)
      .nullable();
  });
}

/**
 * Drop table USERS.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(TABLE_NAME);
}
