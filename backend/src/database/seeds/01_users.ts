import { Knex } from "knex";
import bcrypt from "bcryptjs";

const TABLE_NAME = "users";

/**
 * Delete existing entries and seed values for table USERS.
 *
 * @param   {Knex} knex
 * @returns {Promise<void>}
 */
export async function seed(knex: Knex): Promise<void> {
  // Hash passwords
  const hashedSuperAdminPassword = await bcrypt.hash("superadminpassword", 10);
  const hashedDimplePassword = await bcrypt.hash("dimplepassword", 10);
  const hashedDemoPassword = await bcrypt.hash("demopassword", 10);

  await knex(TABLE_NAME).del();
  await knex(TABLE_NAME).insert([
    {
      email: "superadmin@gmail.com",
      password: hashedSuperAdminPassword,
      name: "Super Admin",
      role: "superadmin",
      image: null,
      created_at: knex.fn.now(),
    },
    {
      id: 2,
      email: "dimple@gmail.com",
      password: hashedDimplePassword,
      name: "Dimple Saraogi",
      role: "user",
      image: null,
      created_at: knex.fn.now(),
    },
    {
      id: 3,
      email: "demo@gmail.com",
      password: hashedDemoPassword,
      name: "Demo User",
      role: "user",
      image: null,
      created_at: knex.fn.now(),
    },
    {
      email: "demo1@gmail.com",
      password: hashedDemoPassword,
      name: "Demo User",
      role: "user",
      image: null,
      created_at: knex.fn.now(),
    },
    {
      email: "demo2@gmail.com",
      password: hashedDemoPassword,
      name: "Demo User",
      role: "user",
      image: null,
      created_at: knex.fn.now(),
    },
    {
      email: "demo3@gmail.com",
      password: hashedDemoPassword,
      name: "Demo User",
      role: "user",
      image: null,
      created_at: knex.fn.now(),
    },
  ]);
}
