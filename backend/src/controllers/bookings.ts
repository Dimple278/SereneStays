import { Request, Response } from "express";
import BookingModel from "../models/Booking";
import { NotFoundError } from "../error/Error";

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

export const createBooking = async (req: Request, res: Response) => {
  const newBooking = await BookingModel.save(req.body);
  res.status(201).json(newBooking);
};

export const updateBooking = async (req: Request, res: Response) => {
  const { id } = req.params;
  const booking = await BookingModel.findById(parseInt(id));
  if (!booking) {
    throw new NotFoundError("Booking not found");
  }
  const updatedBooking = await BookingModel.update(
    Number(req.params.id),
    req.body
  );
  res.json(updatedBooking);
};

export const deleteBooking = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const booking = await BookingModel.findById(id);
  if (!booking) {
    throw new NotFoundError("Booking not found");
  }
  await BookingModel.delete(id);
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
