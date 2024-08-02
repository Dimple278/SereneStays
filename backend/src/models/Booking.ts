import db from "../database/db";
import { IBooking } from "../interface/booking";

class BookingModel {
  static async countAll(): Promise<number> {
    const query = db("bookings").count("* as count");
    const [{ count }] = await query;
    return parseInt(`${count}`, 10);
  }
  static async findAll(page: number, limit) {
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

  static async findById(id: number) {
    return db("bookings").where({ id }).first();
  }

  static async save(booking: IBooking) {
    const [newBooking] = await db("bookings").insert(booking).returning("*");
    return newBooking;
  }

  static async update(id: number, booking: IBooking) {
    const [updatedBooking] = await db("bookings")
      .where({ id })
      .update(booking)
      .returning("*");
    return updatedBooking;
  }

  static async delete(id: number) {
    await db("bookings").where({ id }).del();
  }

  static async getBookingsByListingId(listing_id: number) {
    return db("bookings")
      .join("users", "bookings.user_id", "users.id")
      .where("bookings.listing_id", listing_id)
      .select("bookings.*", "users.name as userName");
  }

  static async getBookingsByUserId(userId: number) {
    return db("bookings")
      .join("listings", "bookings.listing_id", "listings.id")
      .where("bookings.user_id", userId)
      .select("bookings.*", "listings.title as listingTitle");
  }

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
