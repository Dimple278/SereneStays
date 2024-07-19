// seed.ts
import { Knex } from "knex";
import { sampleListings } from "../../sampleListing";

const TABLE_NAME = "listings";

/**
 * Delete existing entries and seed values for table LISTINGS.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export async function seed(knex: Knex): Promise<void> {
  await knex(TABLE_NAME).del(); // Delete existing entries

  // Insert new seed data
  await knex(TABLE_NAME).insert(sampleListings);

  console.log("Seed data inserted successfully.");
}
