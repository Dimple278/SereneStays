import db from "../database/db";
import { IListing } from "../interface/listing";
import { BaseModel } from "./base";

class ListingModel extends BaseModel {
  private tableName: string = "listings";

  /**
   * Create a new listing.
   * @param {IListing} listing - The listing details.
   * @returns {Promise<IListing>} The newly created listing.
   */
  public async create(listing: IListing): Promise<IListing> {
    const [newListing] = await db(this.tableName)
      .insert({
        ...listing,
        images: JSON.stringify(listing.images || []),
      })
      .returning("*");
    return newListing;
  }

  /**
   * Save a listing (alias for create).
   * @param {IListing} listing - The listing details.
   * @returns {Promise<IListing>} The saved listing.
   */
  public async save(listing: IListing): Promise<IListing> {
    return await this.create(listing);
  }

  /**
   * Find all listings with pagination.
   * @param {number} page - The page number for pagination.
   * @param {number} limit - The number of items per page.
   * @returns {Promise<IListing[]>} The list of listings with owner details.
   */
  public async findAll(page: number, limit: number): Promise<IListing[]> {
    const listings = await db("listings")
      .select("listings.*", "users.name as ownerName")
      .join("users", "listings.owner_id", "=", "users.id")
      .offset((page - 1) * limit) // Skip the number of items for previous pages
      .limit(limit); // Limit the number of items per page

    return listings;
  }

  /**
   * Find listings by category with pagination.
   * @param {string} category - The category of the listings.
   * @param {number} page - The page number for pagination.
   * @param {number} limit - The number of items per page.
   * @returns {Promise<IListing[]>} The list of listings with owner details.
   */
  public async findByCategory(
    category: string,
    page: number,
    limit: number
  ): Promise<IListing[]> {
    if (category === "ALL") {
      return this.findAll(page, limit);
    }
    const listings = await db("listings")
      .select("listings.*", "users.name as ownerName")
      .join("users", "listings.owner_id", "=", "users.id")
      .where("category", category)
      .offset((page - 1) * limit) // Skip the number of items for previous pages
      .limit(limit); // Limit the number of items per page

    return listings;
  }

  /**
   * Count listings by category.
   * @param {string} category - The category of the listings.
   * @returns {Promise<number>} The total number of listings in the category.
   */
  public async countByCategory(category: string): Promise<number> {
    const query = db("listings").count("* as count");
    if (category !== "ALL") {
      query.where("category", category);
    }
    const [{ count }] = await query;
    return parseInt(`${count}`, 10);
  }

  /**
   * Find a listing by its ID.
   * @param {number} id - The ID of the listing.
   * @returns {Promise<IListing | undefined>} The listing details.
   */
  public async findById(id: number): Promise<IListing | undefined> {
    return await db(this.tableName)
      .select(`${this.tableName}.*`, "users.name as ownerName")
      .join("users", `${this.tableName}.owner_id`, "users.id") // Join the users table on owner_id
      .where(`${this.tableName}.id`, id)
      .first();
  }

  /**
   * Update a listing by its ID.
   * @param {number} id - The ID of the listing to update.
   * @param {Partial<IListing>} listing - The updated listing details.
   * @returns {Promise<IListing>} The updated listing.
   */
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

  /**
   * Delete a listing by its ID.
   * @param {number} id - The ID of the listing to delete.
   * @returns {Promise<void>}
   */
  public async delete(id: number): Promise<void> {
    await db(this.tableName).where({ id }).del();
  }

  /**
   * Search listings by a query with pagination.
   * @param {string} query - The search query.
   * @param {number} page - The page number for pagination.
   * @param {number} limit - The number of items per page.
   * @returns {Promise<IListing[]>} The list of matching listings.
   */
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

  /**
   * Count the number of listings matching a search query.
   * @param {string} query - The search query.
   * @returns {Promise<number>} The total number of matching listings.
   */
  public async countSearch(query: string): Promise<number> {
    const [{ count }] = await db(this.tableName)
      .count("* as count")
      .where("title", "ilike", `%${query}%`)
      .orWhere("location", "ilike", `%${query}%`)
      .orWhere("country", "ilike", `%${query}%`);
    return parseInt(`${count}`, 10);
  }

  /**
   * Find listings by filters with pagination.
   * @param {number} [minPrice] - The minimum price.
   * @param {number} [maxPrice] - The maximum price.
   * @param {string} [country] - The country.
   * @param {number} [page] - The page number for pagination.
   * @param {number} [limit] - The number of items per page.
   * @returns {Promise<IListing[]>} The list of filtered listings.
   */
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

  /**
   * Count the number of listings matching filters.
   * @param {number} [minPrice] - The minimum price.
   * @param {number} [maxPrice] - The maximum price.
   * @param {string} [country] - The country.
   * @returns {Promise<number>} The total number of matching listings.
   */
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

  /**
   * Find listings by user ID with pagination.
   * @param {number} userId - The user ID.
   * @param {number} page - The page number for pagination.
   * @param {number} limit - The number of items per page.
   * @returns {Promise<IListing[]>} The list of listings owned by the user.
   */
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
