import db from "../db";
import { Listing } from "../interface/listing";

class ListingModel {
  private tableName: string = "listings";

  public async create(listing: Listing): Promise<Listing> {
    const [newListing] = await db(this.tableName)
      .insert({
        ...listing,
        images: JSON.stringify(listing.images),
      })
      .returning("*");
    return newListing;
  }

  public async save(listing: Listing): Promise<Listing> {
    return await this.create(listing);
  }

  public async findAll(): Promise<Listing[]> {
    const listings = await db("listings").select("*");
    // console.log("All listings:", listings);
    return listings;
  }

  public async findByCategory(category: string): Promise<Listing[]> {
    if (category === "ALL") {
      return this.findAll();
    }
    console.log(`Listings for category${category}`);
    const listings = await db("listings")
      .select("*")
      .where("category", category);

    console.log(`Listings for category ${category}:`, listings);
    return listings;
  }

  public async findById(id: number): Promise<Listing | undefined> {
    return await db(this.tableName).where({ id }).first();
  }

  public async update(id: number, listing: Partial<Listing>): Promise<Listing> {
    const [updatedListing] = await db(this.tableName)
      .where({ id })
      .update(listing)
      .returning("*");
    return updatedListing;
  }

  public async delete(id: number): Promise<void> {
    await db(this.tableName).where({ id }).del();
  }
}

export default new ListingModel();
