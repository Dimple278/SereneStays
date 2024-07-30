import { Knex } from "knex";
import { sampleListings } from "../../sampleListing";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("listings").del();

  // Inserts seed entries
  await knex("listings").insert(
    sampleListings.map((listing) => ({
      ...listing,
      images: JSON.stringify(listing.images),
    }))
  );
}
