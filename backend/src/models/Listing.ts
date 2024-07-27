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
    return listings;
  }

  public async findByCategory(category: string): Promise<Listing[]> {
    if (category === "ALL") {
      return this.findAll();
    }
    const listings = await db("listings")
      .select("*")
      .where("category", category);
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

  public async findByFilters(
    minPrice?: number,
    maxPrice?: number,
    country?: string
  ): Promise<Listing[]> {
    let query = db(this.tableName).select("*");

    if (minPrice !== undefined) {
      query = query.where("price", ">=", minPrice);
    }

    if (maxPrice !== undefined) {
      query = query.where("price", "<=", maxPrice);
    }

    if (country) {
      query = query.where("country", "ILIKE", `%${country}%`);
    }

    return query;
  }

  public async search(query: string): Promise<Listing[]> {
    return await db(this.tableName)
      .select("*")
      .where("title", "ilike", `%${query}%`)
      // .orWhere("description", "ilike", `%${query}%`)
      .orWhere("location", "ilike", `%${query}%`)
      .orWhere("country", "ilike", `%${query}%`);
  }
}

export default new ListingModel();
