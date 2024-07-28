import { Request, Response } from "express";
import { AuthRequest, Params } from "../interface/auth.interface";
import ListingModel from "../models/Listing";
import { NotFoundError, UnauthorizedError } from "../error/Error";
import { cloudinary } from "../../cloudinary";
import { IUser } from "../interface/user";
import { Listing } from "../interface/listing";

export const getListings = async (req: Request, res: Response) => {
  const category = (req.query.category as string) || "ALL";
  const page = parseInt(req.query.page as string, 10) || 1; // Default to page 1
  const limit = parseInt(req.query.limit as string, 10) || 10; // Default to 10 items per page

  const listings = await ListingModel.findByCategory(category, page, limit);
  const totalCount = await ListingModel.countByCategory(category);

  res.json({ listings, totalCount });
};

export const getListingById = async (
  req: AuthRequest<{ id: string }>,
  res: Response
) => {
  const id = parseInt(req.params.id as string, 10);
  const listing = await ListingModel.findById(id);
  if (!listing) {
    throw new NotFoundError("Listing not found");
  }
  res.json(listing);
};

// Controller method to handle image uploads
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

  // Ensure the body conforms to the Listing interface
  const newListingData: Listing = {
    ...body,
    images,
    owner_id: user.id,
  };
  // Create a new listing with images
  const newListing = await ListingModel.save(newListingData);

  res.status(201).json(newListing);
};

export const updateListing = async (
  req: AuthRequest<{ id: string }>,
  res: Response
) => {
  const id = parseInt(req.params.id as string, 10);
  const { files, body } = req;

  // Get the existing listing
  const listing = await ListingModel.findById(id);
  if (!listing) {
    throw new NotFoundError("Listing not found");
  }

  // Ensure images is always an array of strings
  const existingImages: string[] = Array.isArray(listing.images)
    ? listing.images
    : [];
  const newImages: string[] = [];

  // Process uploaded images
  if (files && Array.isArray(files)) {
    for (const file of files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "airbnb",
      });
      newImages.push(result.secure_url);
    }
  }

  // Combine existing images with new images
  const updatedImages = newImages;

  // Update the listing with new data and images
  const updatedListing = await ListingModel.update(id, {
    ...body,
    images: updatedImages,
  });

  res.json(updatedListing);
};

export const deleteListing = async (
  req: AuthRequest<Params>,
  res: Response
) => {
  const id = parseInt(req.params.id as string, 10);
  const user = req.user as IUser;

  const listing = await ListingModel.findById(id);
  if (!listing) {
    throw new NotFoundError("Listing not found");
  }

  if (listing.owner_id !== user.id && user.role !== "superadmin") {
    throw new UnauthorizedError(
      "You are not authorized to delete this listing"
    );
  }

  await ListingModel.delete(id);
  res.redirect("/api/listings");
};

export const filterListings = async (req: Request, res: Response) => {
  const { minPrice, maxPrice, country } = req.query;
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 10;

  const listings = await ListingModel.findByFilters(
    minPrice ? parseFloat(minPrice as string) : undefined,
    maxPrice ? parseFloat(maxPrice as string) : undefined,
    country as string,
    page,
    limit
  );
  const totalCount = await ListingModel.countByFilters(
    minPrice ? parseFloat(minPrice as string) : undefined,
    maxPrice ? parseFloat(maxPrice as string) : undefined,
    country as string
  );

  if (!listings.length) {
    throw new NotFoundError("No such Listings found");
  }

  res.json({ listings, totalCount });
};

export const searchListings = async (req: Request, res: Response) => {
  const query = req.query.q as string;
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 10;

  const listings = await ListingModel.search(query, page, limit);
  const totalCount = await ListingModel.countSearch(query);

  if (!listings.length) {
    throw new NotFoundError("No such Listings found");
  }

  res.json({ listings, totalCount });
};
