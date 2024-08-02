// services/BookingService.ts
import BookingModel from "../models/Booking";
import { IUser } from "../interface/user";
import { IBooking } from "../interface/booking";
import { NotFoundError } from "../error/NotFoundError";
import { UnauthorizedError } from "../error/UnauthorizedError";

/**
 * Get all bookings with pagination
 * @param {number} page - Page number
 * @param {number} limit - Number of items per page
 * @returns {Promise<{ bookings: IBooking[], totalCount: number }>}
 */
export const getAllBookings = async (
  page: number,
  limit: number
): Promise<{ bookings: IBooking[]; totalCount: number }> => {
  const bookings = await BookingModel.findAll(page, limit);
  const totalCount = await BookingModel.countAll();
  return { bookings, totalCount };
};

/**
 * Get a booking by ID
 * @param {number} id - Booking ID
 * @returns {Promise<IBooking>}
 * @throws {NotFoundError} - If booking is not found
 */
export const getBookingById = async (id: number): Promise<IBooking> => {
  const booking = await BookingModel.findById(id);
  if (!booking) {
    throw new NotFoundError("Booking not found");
  }
  return booking;
};

/**
 * Create a new booking
 * @param {IUser} user - Authenticated user
 * @param {number} listingId - Listing ID
 * @param {IBooking} bookingData - Data for the new booking
 * @returns {Promise<IBooking>}
 * @throws {UnauthorizedError} - If user is not authenticated
 */
export const createBooking = async (
  user: IUser,
  listingId: number,
  bookingData: IBooking
): Promise<IBooking> => {
  if (!user) {
    throw new UnauthorizedError("User not authenticated");
  }

  const newBookingData = {
    ...bookingData,
    user_id: user.id,
    listing_id: listingId,
  };

  return await BookingModel.save(newBookingData);
};

/**
 * Update an existing booking
 * @param {number} id - Booking ID
 * @param {IBooking} bookingData - Data to update the booking
 * @returns {Promise<IBooking>}
 * @throws {NotFoundError} - If booking is not found
 */
export const updateBooking = async (
  id: number,
  bookingData: IBooking
): Promise<IBooking> => {
  const booking = await BookingModel.findById(id);
  if (!booking) {
    throw new NotFoundError("Booking not found");
  }

  return await BookingModel.update(id, bookingData);
};

/**
 * Delete a booking
 * @param {number} id - Booking ID
 * @returns {Promise<IBooking>}
 * @throws {NotFoundError} - If booking is not found
 */
export const deleteBooking = async (id: number): Promise<IBooking> => {
  const booking = await BookingModel.findById(id);
  if (!booking) {
    throw new NotFoundError("Booking not found");
  }
  await BookingModel.delete(id);
  return booking;
};

/**
 * Get bookings by listing ID
 * @param {number} listingId - Listing ID
 * @returns {Promise<IBooking[]>}
 * @throws {NotFoundError} - If no bookings are found for the listing
 */
export const getBookingsByListingId = async (
  listingId: number
): Promise<IBooking[]> => {
  const bookings = await BookingModel.getBookingsByListingId(listingId);
  if (!bookings.length) {
    throw new NotFoundError("No reviews found for this listing");
  }
  return bookings;
};

/**
 * Get bookings by user ID
 * @param {number} userId - User ID
 * @returns {Promise<IBooking[]>}
 * @throws {NotFoundError} - If no bookings are found for the user
 */
export const getBookingsByUserId = async (
  userId: number
): Promise<IBooking[]> => {
  const bookings = await BookingModel.getBookingsByUserId(userId);
  if (!bookings.length) {
    throw new NotFoundError("No bookings found for this user");
  }
  return bookings;
};

/**
 * Get bookings by user ID and listing ID
 * @param {number} userId - User ID
 * @param {number} listingId - Listing ID
 * @returns {Promise<IBooking[]>}
 * @throws {NotFoundError} - If no bookings are found for the user and listing
 */
export const getBookingsByUserAndListingId = async (
  userId: number,
  listingId: number
): Promise<IBooking[]> => {
  const bookings = await BookingModel.getBookingsByUserAndListingId(
    userId,
    listingId
  );
  if (!bookings.length) {
    throw new NotFoundError("No bookings found for this user and listing");
  }
  return bookings;
};
