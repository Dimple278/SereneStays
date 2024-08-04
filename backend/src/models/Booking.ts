import db from "../database/db";
import { IBooking } from "../interface/booking";
import { BaseModel } from "./base";

class BookingModel {
  /**
   * Count all bookings in the database.
   * @returns {Promise<number>} The total number of bookings.
   */
  static async countAll(): Promise<number> {
    const query = db("bookings").count("* as count");
    const [{ count }] = await query;
    return parseInt(`${count}`, 10);
  }

  /**
   * Find all bookings with pagination.
   * @param {number} page - The page number for pagination.
   * @param {number} limit - The number of items per page.
   * @returns {Promise<Array>} The list of bookings with user and listing details.
   */
  static async findAll(page: number, limit: number) {
    const bookings = await db("bookings")
      .select(
        "bookings.*",
        "users.name as userName",
        "listings.title as listingTitle"
      )
      .join("users", "bookings.user_id", "users.id")
      .join("listings", "bookings.listing_id", "listings.id")
      .offset((page - 1) * limit) // Skip the number of items for previous pages
      .limit(limit); // Limit the number of items per page
    return bookings;
  }

  /**
   * Find a booking by its ID.
   * @param {number} id - The ID of the booking.
   * @returns {Promise<Object>} The booking details.
   */
  static async findById(id: number) {
    return db("bookings").where({ id }).first();
  }

  /**
   * Save a new booking to the database.
   * @param {IBooking} booking - The booking details.
   * @returns {Promise<Object>} The newly created booking.
   */
  static async save(booking: IBooking) {
    const [newBooking] = await db("bookings").insert(booking).returning("*");
    return newBooking;
  }

  /**
   * Update an existing booking by its ID.
   * @param {number} id - The ID of the booking to update.
   * @param {IBooking} booking - The updated booking details.
   * @returns {Promise<Object>} The updated booking.
   */
  static async update(id: number, booking: IBooking) {
    const [updatedBooking] = await db("bookings")
      .where({ id })
      .update(booking)
      .returning("*");
    return updatedBooking;
  }

  /**
   * Delete a booking by its ID.
   * @param {number} id - The ID of the booking to delete.
   * @returns {Promise<void>}
   */
  static async delete(id: number) {
    await db("bookings").where({ id }).del();
  }

  /**
   * Get all bookings for a specific listing by the listing's ID.
   * @param {number} listing_id - The ID of the listing.
   * @returns {Promise<Array>} The list of bookings with user details.
   */
  static async getBookingsByListingId(listing_id: number) {
    return db("bookings")
      .join("users", "bookings.user_id", "users.id")
      .where("bookings.listing_id", listing_id)
      .select("bookings.*", "users.name as userName");
  }

  /**
   * Get all bookings for a specific user by the user's ID.
   * @param {number} userId - The ID of the user.
   * @returns {Promise<Array>} The list of bookings with listing details.
   */
  static async getBookingsByUserId(userId: number) {
    return db("bookings")
      .join("listings", "bookings.listing_id", "listings.id")
      .where("bookings.user_id", userId)
      .select("bookings.*", "listings.title as listingTitle");
  }

  /**
   * Get bookings for a specific user and listing by their IDs.
   * @param {number} userId - The ID of the user.
   * @param {number} listingId - The ID of the listing.
   * @returns {Promise<Array>} The list of bookings for the user and listing.
   */
  static async getBookingsByUserAndListingId(
    userId: number,
    listingId: number
  ) {
    return db("bookings")
      .where({ user_id: userId, listing_id: listingId })
      .select("bookings.*", "listings.title as listingTitle")
      .join("listings", "bookings.listing_id", "listings.id");
  }
}

export default BookingModel;
