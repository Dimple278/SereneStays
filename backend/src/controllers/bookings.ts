import { Request, Response } from "express";
import BookingModel from "../models/Booking";
import { NotFoundError, UnauthorizedError } from "../error/Error";
import { AuthRequest } from "../interface/auth.interface";
import { IUser } from "../interface/user";

export const getBookings = async (req: Request, res: Response) => {
  const allBookings = await BookingModel.findAll();
  res.json(allBookings);
};

export const getBookingById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const booking = await BookingModel.findById(parseInt(id));
  if (!booking) {
    throw new NotFoundError("Booking not found");
  }
  res.json(booking);
};

export const createBooking = async (
  req: AuthRequest<{ listing_id: string }>,
  res: Response
) => {
  const user = req.user as IUser;
  if (!user) {
    throw new UnauthorizedError("User not authenticated");
  }

  const { listing_id } = req.params;
  console.log("User ID:", user.id);
  console.log("Listing ID:", listing_id);
  console.log("New booking data:", req.body);
  const newBookingData = {
    ...req.body,
    user_id: user.id,
    listing_id: parseInt(listing_id, 10),
  };

  const newBooking = await BookingModel.save(newBookingData);
  res.status(201).json(newBooking);
};

export const updateBooking = async (
  req: AuthRequest<{ id: string }>,
  res: Response
) => {
  const { id } = req.params;
  const booking = await BookingModel.findById(parseInt(id));
  if (!booking) {
    throw new NotFoundError("Booking not found");
  }

  const updatedBooking = await BookingModel.update(parseInt(id), req.body);
  res.json(updatedBooking);
};

export const deleteBooking = async (
  req: AuthRequest<{ id: string }>,
  res: Response
) => {
  const { id } = req.params;
  const booking = await BookingModel.findById(parseInt(id));
  if (!booking) {
    throw new NotFoundError("Booking not found");
  }
  await BookingModel.delete(parseInt(id));
  res.json(booking);
};

export const getBookingsByListingId = async (req: Request, res: Response) => {
  const { listing_id } = req.params;
  const bookings = await BookingModel.getBookingsByListingId(
    parseInt(listing_id)
  );
  if (!bookings.length) {
    throw new NotFoundError("No reviews found for this listing");
  }
  res.json(bookings);
};
