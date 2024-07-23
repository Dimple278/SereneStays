import { Knex } from "knex";

const TABLE_NAME = "reviews";

/**
 * Delete existing entries and seed values for table reviews.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export async function seed(knex: Knex): Promise<void> {
  // Delete existing entries
  await knex(TABLE_NAME).del();

  // Insert initial data
  await knex(TABLE_NAME).insert([
    {
      comment: "Great place to stay. Highly recommended!",
      rating: 5,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      author_id: 4,
      listing_id: 36,
    },
    {
      comment: "Nice location but could use some improvements.",
      rating: 3,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      author_id: 5,
      listing_id: 36,
    },
    {
      comment: "Amazing experience! Would definitely stay again.",
      rating: 4,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      author_id: 4,
      listing_id: 36,
    },
    {
      comment: "The place was not as described. Disappointing.",
      rating: 2,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      author_id: 11,
      listing_id: 36,
    },
  ]);
}
