import db from "../db";
import { IBooking } from "../interface/booking";

class BookingModel {
  static async findAll() {
    return db("bookings").select("*");
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
    return db("bookings").where({ listing_id }).select("*");
  }
}

export default BookingModel;
