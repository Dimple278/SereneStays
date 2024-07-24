import { Request, Response } from "express";
import ListingModel from "../models/Listing";

import { NotFoundError } from "../error/Error";

export const getListings = async (req: Request, res: Response) => {
  const allListings = await ListingModel.findAll();
  res.json(allListings);
};

export const getListingById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const listing = await ListingModel.findById(parseInt(id));
  if (!listing) {
    throw new NotFoundError("Listing not found");
  }
  res.json(listing);
};

export const createListing = async (req: Request, res: Response) => {
  const newListing = await ListingModel.save(req.body);
  res.status(201).json(newListing);
};

export const updateListing = async (req: Request, res: Response) => {
  const { id } = req.params;
  const listing = await ListingModel.findById(parseInt(id));
  if (!listing) {
    throw new NotFoundError("Listing not found");
  }
  const updatedListing = await ListingModel.update(
    Number(req.params.id),
    req.body
  );
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
