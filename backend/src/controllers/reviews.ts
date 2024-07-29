import { Request, Response } from "express";
import Review from "../models/Review";
import { NotFoundError, UnauthorizedError } from "../error/Error";
import { AuthRequest } from "../interface/auth.interface";
import { IUser } from "../interface/user";

export const getReviews = async (req: Request, res: Response) => {
  const allReviews = await Review.findAll();
  res.json(allReviews);
};

export const getReviewById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const review = await Review.findById(parseInt(id));
  if (!review) {
    throw new NotFoundError("Review not found");
  }
  res.json(review);
};

export const createReview = async (
  req: AuthRequest<{ listing_id: string }>,
  res: Response
) => {
  const user = req.user as IUser;
  if (!user) {
    throw new UnauthorizedError("User not authenticated");
  }

  const { listing_id } = req.params;
  const newReviewData = {
    ...req.body,
    author_id: user.id,
    listing_id: parseInt(listing_id, 10),
  };

  const newReview = await Review.save(newReviewData);
  res.status(201).json(newReview);
};

export const updateReview = async (
  req: AuthRequest<{ id: string }>,
  res: Response
) => {
  const user = req.user as IUser;
  if (!user) {
    throw new UnauthorizedError("User not authenticated");
  }

  const { id } = req.params;
  const review = await Review.findById(parseInt(id));
  if (!review) {
    throw new NotFoundError("Review not found");
  }

  const updatedReview = await Review.update(Number(req.params.id), req.body);
  res.json(updatedReview);
};

export const deleteReview = async (
  req: AuthRequest<{ id: string }>,
  res: Response
) => {
  const user = req.user as IUser;
  if (!user) {
    throw new UnauthorizedError("User not authenticated");
  }

  const { id } = req.params;
  const review = await Review.findById(parseInt(id));
  if (!review) {
    throw new NotFoundError("Review not found");
  }

  await Review.delete(Number(req.params.id));
  res.json(review);
};

export const getReviewsByListingId = async (req: Request, res: Response) => {
  const { listing_id } = req.params;
  const reviews = await Review.getReviewsByListingId(parseInt(listing_id));
  if (!reviews.length) {
    throw new NotFoundError("No reviews found for this listing");
  }
  res.json(reviews);
};
