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
  console.log("auth list", listing);

  if (!listing) {
    throw new NotFoundError("Listing not found");
  }

  console.log("user.id:", user.id);
  console.log("listing.ownerId:", listing.ownerId);

  if (
    Number(listing.ownerId) !== Number(user.id) &&
    user.role !== "superadmin"
  ) {
    throw new UnauthorizedError("User not authorized to perform this action");
  }

  next();
};
