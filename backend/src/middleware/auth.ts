import config from "../config";
import { NextFunction, Response } from "express";
import { verify } from "jsonwebtoken";
import { IUser } from "../interface/user";
import { AuthRequest, Params } from "../interface/auth.interface";
import Listing from "../models/Listing";
import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
} from "../error/Error";
import BookingModel from "../models/Booking";
import Review from "../models/Review";

// Middleware to authenticate user
export async function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const { authorization } = req.headers;

  if (!authorization) {
    const error = new UnauthorizedError("Unauthorized");
    next(error);
    return;
  }

  const token = authorization.split(" ");

  if (token.length !== 2 || token[0] !== "Bearer") {
    const error = new BadRequestError("Invalid token");
    next(error);
    return;
  }

  try {
    const user = (await verify(token[1], config.jwt.secret!)) as IUser;

    req.user = user;
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "TokenExpiredError") {
        const customError = new UnauthorizedError("Token has expired");
        next(customError);
        return;
      } else if (error.name === "JsonWebTokenError") {
        const customError = new BadRequestError("Invalid token");
        next(customError);
        return;
      }
    }
    const unknownError = new InternalServerError("Could not authenticate");
    next(unknownError);
  }
  next();
}

export const authorize = async (
  req: AuthRequest<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const user = req.user as IUser;

  if (!user) {
    throw new UnauthorizedError("User not authenticated");
  }

  // Ensure id is parsed as a number
  const listingId = parseInt(id, 10);
  if (isNaN(listingId)) {
    throw new NotFoundError("Invalid listing ID");
  }

  const listing = await Listing.findById(listingId);
  // console.log("auth list", listing);

  if (!listing) {
    throw new NotFoundError("Listing not found");
  }

  if (
    Number(listing.ownerId) !== Number(user.id) &&
    user.role !== "superadmin"
  ) {
    throw new UnauthorizedError("User not authorized to perform this action");
  }

  next();
};

export const authorizeBooking = async (
  req: AuthRequest<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const user = req.user;

  if (!user) {
    throw new UnauthorizedError("User not authenticated");
  }

  const booking = await BookingModel.findById(parseInt(id));
  if (!booking) {
    throw new NotFoundError("Booking not found");
  }
  console.log("booking.user_id:", booking.user_id);
  console.log("user.id:", user.id);

  if (booking.userId !== user.id && user.role !== "superadmin") {
    throw new UnauthorizedError("User not authorized to perform this action");
  }

  next();
};

export const authorizeReviewOwner = async (
  req: AuthRequest<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user as IUser;
    const { id } = req.params;

    const review = await Review.findById(parseInt(id, 10)); // Ensure id is parsed as a number with base 10
    if (!review) {
      throw new NotFoundError("Review not found");
    }

    console.log("review.authorId:", review.authorId);
    console.log("user.id:", user.id);
    console.log("typeof user.id:", typeof user.id);
    console.log("typeof review.authorId:", typeof parseInt(review.authorId));
    console.log(parseInt(review.authorId) !== user.id);
    // Convert user.id to a string for comparison
    if (parseInt(review.authorId) !== user.id) {
      throw new UnauthorizedError(
        "You are not authorized to perform this action"
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};
