import { Request, Response } from "express";
import * as BookingService from "../services/bookings";
import { AuthRequest } from "../interface/auth.interface";
import { IUser } from "../interface/user";
import { IBooking } from "../interface/booking";

/**
 * Get all bookings with pagination
 * @param {Request} req
 * @param {Response} res
 */
export const getBookings = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 10;
  const { bookings, totalCount } = await BookingService.getAllBookings(
    page,
    limit
  );
  res.json({ bookings, totalCount });
};

/**
 * Get a booking by ID
 * @param {Request} req
 * @param {Response} res
 */
export const getBookingById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const booking = await BookingService.getBookingById(parseInt(id));
  res.json(booking);
};

/**
 * Create a new booking
 * @param {AuthRequest<{ listing_id: string }>} req
 * @param {Response} res
 */
export const createBooking = async (
  req: AuthRequest<{ listing_id: string }>,
  res: Response
) => {
  const user = req.user as IUser;
  const { listing_id } = req.params;
  const newBooking = await BookingService.createBooking(
    user,
    parseInt(listing_id, 10),
    req.body as IBooking
  );
  res.status(201).json(newBooking);
};

/**
 * Update an existing booking
 * @param {AuthRequest<{ id: string }>} req
 * @param {Response} res
 */
export const updateBooking = async (
  req: AuthRequest<{ id: string }>,
  res: Response
) => {
  const { id } = req.params;
  const updatedBooking = await BookingService.updateBooking(
    parseInt(id),
    req.body as IBooking
  );
  res.json(updatedBooking);
};

/**
 * Delete a booking
 * @param {AuthRequest<{ id: string }>} req
 * @param {Response} res
 */
export const deleteBooking = async (
  req: AuthRequest<{ id: string }>,
  res: Response
) => {
  const { id } = req.params;
  const booking = await BookingService.deleteBooking(parseInt(id));
  res.json(booking);
};

/**
 * Get bookings by listing ID
 * @param {Request} req
 * @param {Response} res
 */
export const getBookingsByListingId = async (req: Request, res: Response) => {
  const { listing_id } = req.params;
  const bookings = await BookingService.getBookingsByListingId(
    parseInt(listing_id)
  );
  res.json(bookings);
};

/**
 * Get bookings by user ID
 * @param {Request} req
 * @param {Response} res
 */
export const getBookingsByUserId = async (req: Request, res: Response) => {
  const { user_id } = req.params;
  const bookings = await BookingService.getBookingsByUserId(parseInt(user_id));
  res.json(bookings);
};

/**
 * Get bookings by user ID and listing ID
 * @param {AuthRequest<{ listing_id: string }>} req - Express authenticated request object
 * @param {Response} res - Express response object
 */
export const getUserBookingsForListing = async (
  req: AuthRequest<{ listing_id: string }>,
  res: Response
) => {
  const user = req.user as IUser;
  const { listing_id } = req.params;
  const bookings = await BookingService.getBookingsByUserAndListingId(
    user.id,
    parseInt(listing_id, 10)
  );
  res.json(bookings);
};
