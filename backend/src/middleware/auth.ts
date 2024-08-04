import config from "../config";
import { NextFunction, Response } from "express";
import { verify } from "jsonwebtoken";
import { IUser } from "../interface/user";
import { AuthRequest, Params } from "../interface/auth.interface";
import Listing from "../models/Listing";
import BookingModel from "../models/Booking";
import Review from "../models/Review";
import { BadRequestError } from "../error/BadRequestError";
import { InternalServerError } from "../error/InternalServerError";
import { NotFoundError } from "../error/NotFoundError";
import { UnauthorizedError } from "../error/UnauthorizedError";

/**
 * Middleware to authenticate user based on JWT
 * @param {AuthRequest} req - Express request object with extended AuthRequest interface
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function to pass control to the next middleware
 * @returns {Promise<void>}
 * @throws {UnauthorizedError} - If no authorization header is present
 * @throws {BadRequestError} - If token format is invalid
 * @throws {UnauthorizedError} - If token has expired
 * @throws {BadRequestError} - If token is invalid
 * @throws {InternalServerError} - For other authentication errors
 */
export async function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
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

/**
 * Middleware to authorize user for listing operations
 * @param {AuthRequest<{ id: string }>} req - Express request object with listing ID in params and authenticated user
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function to pass control to the next middleware
 * @returns {Promise<void>}
 * @throws {UnauthorizedError} - If user is not authenticated
 * @throws {NotFoundError} - If listing ID is invalid or listing is not found
 * @throws {UnauthorizedError} - If user is not authorized to access the listing
 */
export const authorize = async (
  req: AuthRequest<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params;
  const user = req.user as IUser;

  if (!user) {
    throw new UnauthorizedError("User not authenticated");
  }

  const listingId = parseInt(id, 10);
  if (isNaN(listingId)) {
    throw new NotFoundError("Invalid listing ID");
  }

  const listing = await Listing.findById(listingId);

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

/**
 * Middleware to authorize user for booking operations
 * @param {AuthRequest<{ id: string }>} req - Express request object with booking ID in params and authenticated user
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function to pass control to the next middleware
 * @returns {Promise<void>}
 * @throws {UnauthorizedError} - If user is not authenticated
 * @throws {NotFoundError} - If booking is not found
 * @throws {UnauthorizedError} - If user is not authorized to access the booking
 */
export const authorizeBooking = async (
  req: AuthRequest<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params;
  const user = req.user as IUser;

  if (!user) {
    throw new UnauthorizedError("User not authenticated");
  }

  const booking = await BookingModel.findById(parseInt(id));

  if (!booking) {
    throw new NotFoundError("Booking not found");
  }

  if (booking.userId !== user.id && user.role !== "superadmin") {
    throw new UnauthorizedError("User not authorized to perform this action");
  }

  next();
};

/**
 * Middleware to authorize user as the owner of a review
 * @param {AuthRequest<{ id: string }>} req - Express request object with review ID in params and authenticated user
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function to pass control to the next middleware
 * @returns {Promise<void>}
 * @throws {NotFoundError} - If review is not found
 * @throws {UnauthorizedError} - If user is not authorized to access the review
 */
export const authorizeReviewOwner = async (
  req: AuthRequest<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = req.user as IUser;
    const { id } = req.params;

    const review = await Review.findById(parseInt(id, 10));
    if (!review) {
      throw new NotFoundError("Review not found");
    }

    if (parseInt(review.authorId) != user.id && user.role !== "superadmin") {
      throw new UnauthorizedError(
        "You are not authorized to perform this action"
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};
