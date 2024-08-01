// controllers/ListingController.ts
import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../interface/auth.interface";
import * as ListingService from "../services/listings";
import { IUser } from "../interface/user";
import { IListing } from "../interface/listing";
import { UnauthorizedError } from "../error/UnauthorizedError";
import { cloudinary } from "../../cloudinary";
import { NotFoundError } from "../error/NotFoundError";

/**
 * Get all listings with pagination
 * @param {Request} req
 * @param {Response} res
 */
export const getListings = async (req: Request, res: Response) => {
  const category = (req.query.category as string) || "ALL";
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 10;

  const { listings, totalCount } = await ListingService.getListingsByCategory(
    category,
    page,
    limit
  );
  res.json({ listings, totalCount });
};

/**
 * Get a listing by ID
 * @param {AuthRequest<{ id: string }>} req
 * @param {Response} res
 */
export const getListingById = async (
  req: AuthRequest<{ id: string }>,
  res: Response
) => {
  const id = parseInt(req.params.id as string, 10);
  const listing = await ListingService.getListingById(id);
  res.json(listing);
};

/**
 * Create a new listing
 * @param {AuthRequest} req
 * @param {Response} res
 */
export const createListing = async (req: AuthRequest, res: Response) => {
  const { files, body } = req;
  const user = req.user as IUser;

  if (!user) {
    throw new UnauthorizedError("User not authenticated");
  }

  const images: string[] = [];

  // Process uploaded images
  if (files && Array.isArray(files)) {
    for (const file of files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "airbnb",
      });
      images.push(result.secure_url);
    }
  }

  const newListingData: IListing = {
    ...body,
    images,
    owner_id: user.id,
  };

  const newListing = await ListingService.createListing(user, newListingData);
  res.status(201).json(newListing);
};

/**
 * Update an existing listing
 * @param {AuthRequest<{ id: string }>} req
 * @param {Response} res
 */
export const updateListing = async (
  req: AuthRequest<{ id: string }>,
  res: Response
) => {
  const id = parseInt(req.params.id as string, 10);
  const { files, body } = req;

  const listing = await ListingService.getListingById(id);
  if (!listing) {
    throw new NotFoundError("Listing not found");
  }

  const existingImages: string[] = Array.isArray(listing.images)
    ? listing.images
    : [];
  const newImages: string[] = [];

  if (files && Array.isArray(files)) {
    for (const file of files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "airbnb",
      });
      newImages.push(result.secure_url);
    }
  }

  const updatedImages = newImages.length > 0 ? newImages : existingImages;

  const updatedListingData: IListing = {
    ...body,
    images: updatedImages,
  };

  const updatedListing = await ListingService.updateListing(
    id,
    updatedListingData
  );
  res.json(updatedListing);
};

/**
 * Delete a listing
 * @param {AuthRequest<{ id: string }>} req
 * @param {Response} res
 */
export const deleteListing = async (
  req: AuthRequest<{ id: string }>,
  res: Response
) => {
  const id = parseInt(req.params.id as string, 10);
  const user = req.user as IUser;

  const listing = await ListingService.getListingById(id);
  if (!listing) {
    throw new NotFoundError("Listing not found");
  }

  await ListingService.deleteListing(id);
  res.json("deleted Listing");
};

/**
 * Filter listings with pagination
 * @param {Request} req
 * @param {Response} res
 */
export const filterListings = async (req: Request, res: Response) => {
  const { minPrice, maxPrice, country } = req.query;
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 10;

  const { listings, totalCount } = await ListingService.getListingsByFilters(
    minPrice ? parseFloat(minPrice as string) : undefined,
    maxPrice ? parseFloat(maxPrice as string) : undefined,
    country as string,
    page,
    limit
  );

  if (!listings.length) {
    throw new NotFoundError("No such Listings found");
  }

  res.json({ listings, totalCount });
};

/**
 * Search listings with pagination
 * @param {Request} req
 * @param {Response} res
 */
export const searchListings = async (req: Request, res: Response) => {
  const query = req.query.q as string;
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 10;

  const { listings, totalCount } = await ListingService.searchListings(
    query,
    page,
    limit
  );

  if (!listings.length) {
    throw new NotFoundError("No such Listings found");
  }

  res.json({ listings, totalCount });
};

/**
 * Get listings by user ID with pagination
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export const getListingsByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const listings = await ListingService.getListingsByUserId(
    parseInt(userId),
    parseInt(page as string),
    parseInt(limit as string)
  );

  if (!listings.length) {
    throw new NotFoundError("No listings found for the specified user");
  }

  res.json(listings);
};
