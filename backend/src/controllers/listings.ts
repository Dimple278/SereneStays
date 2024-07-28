import { Request, Response } from "express";
import ListingModel from "../models/Listing";

import { NotFoundError } from "../error/Error";
import { cloudinary } from "../../cloudinary";

export const getListings = async (req: Request, res: Response) => {
  const category = (req.query.category as string) || "ALL";
  const page = parseInt(req.query.page as string, 10) || 1; // Default to page 1
  const limit = parseInt(req.query.limit as string, 10) || 10; // Default to 10 items per page

  const listings = await ListingModel.findByCategory(category, page, limit);
  const totalCount = await ListingModel.countByCategory(category);

  res.json({ listings, totalCount });
};

export const getListingById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const listing = await ListingModel.findById(parseInt(id));
  if (!listing) {
    throw new NotFoundError("Listing not found");
  }
  res.json(listing);
};

// Controller method to handle image uploads
export const createListing = async (req: Request, res: Response) => {
  const { files, body } = req;
  console.log(files);
  console.log("Images:", files);
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
  console.log("Uploaded images:", images);
  console.log("Listing body:", body);

  // Create a new listing with images
  const newListing = await ListingModel.save({
    ...body,
    images,
  });

  res.status(201).json(newListing);
};

export const updateListing = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { files, body } = req;

  // Get the existing listing
  const listing = await ListingModel.findById(parseInt(id));
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
  // const updatedImages = [...existingImages, ...newImages];
  const updatedImages = newImages;

  // Update the listing with new data and images
  const updatedListing = await ListingModel.update(parseInt(id), {
    ...body,
    images: updatedImages,
  });

  res.json(updatedListing);
};

export const deleteListing = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const listing = await ListingModel.findById(id);
  if (!listing) {
    throw new NotFoundError("Listing not found");
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
