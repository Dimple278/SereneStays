import db from "../db";
import { Listing } from "../interface/listing";

class ListingModel {
  private tableName: string = "listings";

  public async create(listing: Listing): Promise<Listing> {
    const [newListing] = await db(this.tableName)
      .insert({
        ...listing,
        images: JSON.stringify(listing.images || []),
      })
      .returning("*");
    return newListing;
  }

  public async save(listing: Listing): Promise<Listing> {
    return await this.create(listing);
  }

  public async findAll(page: number, limit: number): Promise<Listing[]> {
    const listings = await db("listings")
      .select("*")
      .offset((page - 1) * limit) // Skip the number of items for previous pages
      .limit(limit); // Limit the number of items per page
    return listings;
  }

  public async findByCategory(
    category: string,
    page: number,
    limit: number
  ): Promise<Listing[]> {
    if (category === "ALL") {
      return this.findAll(page, limit);
    }
    const listings = await db("listings")
      .select("*")
      .where("category", category)
      .offset((page - 1) * limit) // Skip the number of items for previous pages
      .limit(limit); // Limit the number of items per page
    return listings;
  }

  public async countByCategory(category: string): Promise<number> {
    const query = db("listings").count("* as count");
    if (category !== "ALL") {
      query.where("category", category);
    }
    const [{ count }] = await query;
    return parseInt(`${count}`, 10);
  }

  public async findById(id: number): Promise<Listing | undefined> {
    return await db(this.tableName).where({ id }).first();
  }

  public async update(id: number, listing: Partial<Listing>): Promise<Listing> {
    const updatedListing = await db(this.tableName)
      .where({ id })
      .update({
        ...listing,
        images: listing.images ? JSON.stringify(listing.images) : undefined, // Ensure images is handled properly
      })
      .returning("*");
    return updatedListing[0];
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
