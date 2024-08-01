import db from "../db";
import { IListing } from "../interface/listing";
import { BaseModel } from "./base";
class ListingModel extends BaseModel {
  private tableName: string = "listings";

  public async create(listing: IListing): Promise<IListing> {
    const [newListing] = await db(this.tableName)
      .insert({
        ...listing,
        images: JSON.stringify(listing.images || []),
      })
      .returning("*");
    return newListing;
  }

  public async save(listing: IListing): Promise<IListing> {
    return await this.create(listing);
  }

  public async findAll(page: number, limit: number): Promise<IListing[]> {
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
  ): Promise<IListing[]> {
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

  public async findById(id: number): Promise<IListing | undefined> {
    return await db(this.tableName)
      .select(`${this.tableName}.*`, "users.name as ownerName")
      .join("users", `${this.tableName}.owner_id`, "users.id") // Join the users table on owner_id
      .where(`${this.tableName}.id`, id)
      .first();
  }

  public async update(
    id: number,
    listing: Partial<IListing>
  ): Promise<IListing> {
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

  public async search(
    query: string,
    page: number,
    limit: number
  ): Promise<IListing[]> {
    return await db(this.tableName)
      .select("*")
      .where("title", "ilike", `%${query}%`)
      .orWhere("location", "ilike", `%${query}%`)
      .orWhere("country", "ilike", `%${query}%`)
      .offset((page - 1) * limit)
      .limit(limit);
  }

  public async countSearch(query: string): Promise<number> {
    const [{ count }] = await db(this.tableName)
      .count("* as count")
      .where("title", "ilike", `%${query}%`)
      .orWhere("location", "ilike", `%${query}%`)
      .orWhere("country", "ilike", `%${query}%`);
    return parseInt(`${count}`, 10);
  }

  public async findByFilters(
    minPrice?: number,
    maxPrice?: number,
    country?: string,
    page?: number,
    limit?: number
  ): Promise<IListing[]> {
    let listingsQuery = db(this.tableName).select("*");

    if (minPrice !== undefined) {
      listingsQuery = listingsQuery.where("price", ">=", minPrice);
    }

    if (maxPrice !== undefined) {
      listingsQuery = listingsQuery.where("price", "<=", maxPrice);
    }

    if (country) {
      listingsQuery = listingsQuery.where("country", "ILIKE", `%${country}%`);
    }

    return await listingsQuery.offset((page - 1) * limit).limit(limit);
  }

  public async countByFilters(
    minPrice?: number,
    maxPrice?: number,
    country?: string
  ): Promise<number> {
    let totalCountQuery = db(this.tableName).count("* as count");

    if (minPrice !== undefined) {
      totalCountQuery = totalCountQuery.where("price", ">=", minPrice);
    }

    if (maxPrice !== undefined) {
      totalCountQuery = totalCountQuery.where("price", "<=", maxPrice);
    }

    if (country) {
      totalCountQuery = totalCountQuery.where(
        "country",
        "ILIKE",
        `%${country}%`
      );
    }

    const [{ count }] = await totalCountQuery;
    return parseInt(`${count}`, 10);
  }

  public async findByUserId(
    userId: number,
    page: number,
    limit: number
  ): Promise<IListing[]> {
    const listings = await db(this.tableName)
      .select("*")
      .where("owner_id", userId)
      .offset((page - 1) * limit)
      .limit(limit);
    return listings;
  }
}

export default new ListingModel();
