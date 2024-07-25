import db from "../db";

interface Booking {
  id?: number;
  user_id: number;
  listing_id: number;
  start_date: string;
  end_date: string;
  total_price: number;
  created_at?: Date;
  updated_at?: Date;
}

class BookingModel {
  static async findAll() {
    return db("bookings").select("*");
  }

  static async findById(id: number) {
    return db("bookings").where({ id }).first();
  }

  static async save(booking: Booking) {
    const [newBooking] = await db("bookings").insert(booking).returning("*");
    return newBooking;
  }

  static async update(id: number, booking: Booking) {
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
