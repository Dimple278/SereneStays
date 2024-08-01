// services/ListingService.ts
import ListingModel from "../models/Listing";
import { IUser } from "../interface/user";
import { IListing } from "../interface/listing";
import { NotFoundError } from "../error/NotFoundError";
import { UnauthorizedError } from "../error/UnauthorizedError";

/**
 * Get all listings by category with pagination
 * @param {string} category - Category of the listing
 * @param {number} page - Page number for pagination
 * @param {number} limit - Limit of listings per page
 * @returns {Promise<{listings: Listing[], totalCount: number}>}
 */
export const getListingsByCategory = async (
  category: string,
  page: number,
  limit: number
) => {
  const listings = await ListingModel.findByCategory(category, page, limit);
  const totalCount = await ListingModel.countByCategory(category);
  return { listings, totalCount };
};

/**
 * Get a listing by ID
 * @param {number} id - Listing ID
 * @returns {Promise<Listing>}
 * @throws {NotFoundError} - If listing is not found
 */
export const getListingById = async (id: number): Promise<IListing> => {
  const listing = await ListingModel.findById(id);
  if (!listing) {
    throw new NotFoundError("Listing not found");
  }
  return listing;
};

/**
 * Create a new listing
 * @param {IUser} user - Authenticated user
 * @param {Listing} listingData - Data for the new listing
 * @returns {Promise<Listing>}
 * @throws {UnauthorizedError} - If user is not authenticated
 */
export const createListing = async (
  user: IUser,
  listingData: IListing
): Promise<IListing> => {
  if (!user) {
    throw new UnauthorizedError("User not authenticated");
  }
  listingData.owner_id = user.id;
  return await ListingModel.save(listingData);
};

/**
 * Update an existing listing
 * @param {number} id - Listing ID
 * @param {Listing} listingData - Data to update the listing
 * @returns {Promise<Listing>}
 * @throws {NotFoundError} - If listing is not found
 */
export const updateListing = async (
  id: number,
  listingData: IListing
): Promise<IListing> => {
  const listing = await ListingModel.findById(id);
  if (!listing) {
    throw new NotFoundError("Listing not found");
  }
  return await ListingModel.update(id, listingData);
};

/**
 * Delete a listing
 * @param {number} id - Listing ID
 * @returns {Promise<Listing>}
 * @throws {NotFoundError} - If listing is not found
 */
export const deleteListing = async (id: number): Promise<IListing> => {
  const listing = await ListingModel.findById(id);
  if (!listing) {
    throw new NotFoundError("Listing not found");
  }
  await ListingModel.delete(id);
  return listing;
};

/**
 * Get listings by filters with pagination
 * @param {number | undefined} minPrice - Minimum price filter
 * @param {number | undefined} maxPrice - Maximum price filter
 * @param {string} country - Country filter
 * @param {number} page - Page number for pagination
 * @param {number} limit - Limit of listings per page
 * @returns {Promise<{listings: Listing[], totalCount: number}>}
 */
export const getListingsByFilters = async (
  minPrice: number | undefined,
  maxPrice: number | undefined,
  country: string,
  page: number,
  limit: number
) => {
  const listings = await ListingModel.findByFilters(
    minPrice,
    maxPrice,
    country,
    page,
    limit
  );
  const totalCount = await ListingModel.countByFilters(
    minPrice,
    maxPrice,
    country
  );
  return { listings, totalCount };
};

/**
 * Search listings by query with pagination
 * @param {string} query - Search query
 * @param {number} page - Page number for pagination
 * @param {number} limit - Limit of listings per page
 * @returns {Promise<{listings: Listing[], totalCount: number}>}
 */
export const searchListings = async (
  query: string,
  page: number,
  limit: number
) => {
  const listings = await ListingModel.search(query, page, limit);
  const totalCount = await ListingModel.countSearch(query);
  return { listings, totalCount };
};

/**
 * Get listings by user ID with pagination
 * @param {number} userId - User ID
 * @param {number} page - Page number for pagination
 * @param {number} limit - Limit of listings per page
 * @returns {Promise<Listing[]>}
 * @throws {NotFoundError} - If no listings are found for the user
 */
export const getListingsByUserId = async (
  userId: number,
  page: number,
  limit: number
): Promise<IListing[]> => {
  const listings = await ListingModel.findByUserId(userId, page, limit);
  if (!listings.length) {
    throw new NotFoundError("No listings found for the specified user");
  }
  return listings;
};
