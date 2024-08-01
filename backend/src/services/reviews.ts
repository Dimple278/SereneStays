// src/services/ReviewService.ts
import ReviewModel from "../models/Review";
import { Review } from "../interface/review";
import { IUser } from "../interface/user";
import { NotFoundError } from "../error/NotFoundError";
import { UnauthorizedError } from "../error/UnauthorizedError";

/**
 * Get all reviews
 * @returns {Promise<Review[]>}
 */
export const getAllReviews = async (): Promise<Review[]> => {
  return await ReviewModel.findAll();
};

/**
 * Get a review by ID
 * @param {number} id - Review ID
 * @returns {Promise<Review>}
 * @throws {NotFoundError} - If review is not found
 */
export const getReviewById = async (id: number): Promise<Review> => {
  const review = await ReviewModel.findById(id);
  if (!review) {
    throw new NotFoundError("Review not found");
  }
  return review;
};

/**
 * Create a new review
 * @param {IUser} user - Authenticated user
 * @param {Review} reviewData - Data for the new review
 * @returns {Promise<Review>}
 * @throws {UnauthorizedError} - If user is not authenticated
 */
export const createReview = async (
  user: IUser,
  reviewData: Review
): Promise<Review> => {
  if (!user) {
    throw new UnauthorizedError("User not authenticated");
  }
  reviewData.author_id = user.id;
  return await ReviewModel.save(reviewData);
};

/**
 * Update an existing review
 * @param {number} id - Review ID
 * @param {Review} reviewData - Data to update the review
 * @returns {Promise<Review>}
 * @throws {NotFoundError} - If review is not found
 */
export const updateReview = async (
  id: number,
  reviewData: Review
): Promise<Review> => {
  const review = await ReviewModel.findById(id);
  if (!review) {
    throw new NotFoundError("Review not found");
  }
  return await ReviewModel.update(id, reviewData);
};

/**
 * Delete a review
 * @param {number} id - Review ID
 * @returns {Promise<Review>}
 * @throws {NotFoundError} - If review is not found
 */
export const deleteReview = async (id: number): Promise<Review> => {
  const review = await ReviewModel.findById(id);
  if (!review) {
    throw new NotFoundError("Review not found");
  }
  await ReviewModel.delete(id);
  return review;
};

/**
 * Get reviews by listing ID
 * @param {number} listingId - Listing ID
 * @returns {Promise<Review[]>}
 * @throws {NotFoundError} - If no reviews are found for the listing
 */
export const getReviewsByListingId = async (
  listingId: number
): Promise<Review[]> => {
  const reviews = await ReviewModel.getReviewsByListingId(listingId);
  if (!reviews.length) {
    throw new NotFoundError("No reviews found for this listing");
  }
  return reviews;
};
