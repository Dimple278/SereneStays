// src/controllers/ReviewController.ts
import { Request, Response } from "express";
import { AuthRequest } from "../interface/auth.interface";
import * as ReviewService from "../services/reviews";
import { IUser } from "../interface/user";
import { Review } from "../interface/review";
import { NotFoundError } from "../error/NotFoundError";
import { UnauthorizedError } from "../error/UnauthorizedError";

/**
 * Get all reviews
 * @param {Request} req
 * @param {Response} res
 */
export const getReviews = async (req: Request, res: Response) => {
  const allReviews = await ReviewService.getAllReviews();
  res.json(allReviews);
};

/**
 * Get a review by ID
 * @param {Request} req
 * @param {Response} res
 */
export const getReviewById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const review = await ReviewService.getReviewById(parseInt(id, 10));
  if (!review) {
    throw new NotFoundError("Review not found");
  }
  res.json(review);
};

/**
 * Create a new review
 * @param {AuthRequest<{ listing_id: string }>} req
 * @param {Response} res
 */
export const createReview = async (
  req: AuthRequest<{ listing_id: string }>,
  res: Response
) => {
  const user = req.user as IUser;
  if (!user) {
    throw new UnauthorizedError("User not authenticated");
  }

  const { listing_id } = req.params;
  const newReviewData: Review = {
    ...req.body,
    author_id: user.id,
    listing_id: parseInt(listing_id, 10),
  };

  const newReview = await ReviewService.createReview(user, newReviewData);
  res.status(201).json(newReview);
};

/**
 * Update an existing review
 * @param {AuthRequest<{ id: string }>} req
 * @param {Response} res
 */
export const updateReview = async (
  req: AuthRequest<{ id: string }>,
  res: Response
) => {
  const user = req.user as IUser;
  if (!user) {
    throw new UnauthorizedError("User not authenticated");
  }

  const { id } = req.params;
  const review = await ReviewService.getReviewById(parseInt(id, 10));
  if (!review) {
    throw new NotFoundError("Review not found");
  }

  const updatedReviewData: Review = {
    ...req.body,
    author_id: user.id,
    listing_id: review.listing_id,
  };

  const updatedReview = await ReviewService.updateReview(
    parseInt(id, 10),
    updatedReviewData
  );
  res.json(updatedReview);
};

/**
 * Delete a review
 * @param {AuthRequest<{ id: string }>} req
 * @param {Response} res
 */
export const deleteReview = async (
  req: AuthRequest<{ id: string }>,
  res: Response
) => {
  const user = req.user as IUser;
  if (!user) {
    throw new UnauthorizedError("User not authenticated");
  }

  const { id } = req.params;
  const review = await ReviewService.getReviewById(parseInt(id, 10));
  if (!review) {
    throw new NotFoundError("Review not found");
  }

  await ReviewService.deleteReview(parseInt(id, 10));
  res.json(review);
};

/**
 * Get reviews by listing ID
 * @param {Request} req
 * @param {Response} res
 */
export const getReviewsByListingId = async (req: Request, res: Response) => {
  const { listing_id } = req.params;
  const reviews = await ReviewService.getReviewsByListingId(
    parseInt(listing_id, 10)
  );
  if (!reviews.length) {
    throw new NotFoundError("No reviews found for this listing");
  }
  res.json(reviews);
};
