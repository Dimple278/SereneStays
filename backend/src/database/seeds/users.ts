import { Knex } from "knex";

const TABLE_NAME = "users";

/**
 * Delete existing entries and seed values for table users.
 *
 * @param   {Knex} knex
 * @returns {Promise<void>}
 */
export function seed(knex: Knex): Promise<void> {
  return knex(TABLE_NAME)
    .del()
    .then(() => {
      return knex(TABLE_NAME).insert([
        {
          email: "superadmin@example.com",
          password: "hashedpassword1",
          name: "Super Admin",
          role: "superadmin",
          created_at: new Date(),
          created_by: null,
          updated_at: null,
          updated_by: null,
        },
        {
          email: "user@example.com",
          password: "hashedpassword2",
          name: "Normal User",
          role: "user",
          created_at: new Date(),
          created_by: null,
          updated_at: null,
          updated_by: null,
        },
        {
          email: "dimple@example.com",
          password: "hashedpassword2",
          name: "Dimple",
          role: "user",
          created_at: new Date(),
          created_by: null,
          updated_at: null,
          updated_by: null,
        },
        {
          email: "john@example.com",
          password: "hashedpassword2",
          name: "John Doe",
          role: "user",
          created_at: new Date(),
          created_by: null,
          updated_at: null,
          updated_by: null,
        },
      ]);
    });
}
