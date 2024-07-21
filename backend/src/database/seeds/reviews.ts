import { Knex } from "knex";

const TABLE_NAME = "reviews";

/**
 * Delete existing entries and seed values for table TABLE_NAME.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export function seed(knex: Knex): Promise<void> {
  return knex(TABLE_NAME)
    .del()
    .then(() => {
      return knex(TABLE_NAME).insert([
        { comment: "Great place!", rate: 5 },
        { comment: "Good value for money", rate: 4 },
        { comment: "Average experience", rate: 3 },
        { comment: "Not satisfied", rate: 2 },
        { comment: "Terrible service", rate: 1 },
      ]);
    });
}
