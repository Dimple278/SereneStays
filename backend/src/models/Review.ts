import db from "../database/db";
import { Review } from "../interface/review";

class ReviewModel {
  /**
   * Retrieves all reviews from the database.
   * @returns {Promise<any[]>} A promise that resolves to an array of all reviews.
   */
  static async findAll() {
    return db("reviews").select("*");
  }

  /**
   * Retrieves a review by its ID.
   * @param {number} id - The ID of the review to retrieve.
   * @returns {Promise<Review | undefined>} A promise that resolves to the review, or undefined if not found.
   */
  static async findById(id: number) {
    return db("reviews").where({ id }).first();
  }

  /**
   * Saves a new review to the database.
   * @param {Review} review - The review to save.
   * @returns {Promise<Review>} A promise that resolves to the newly created review.
   */
  static async save(review: Review) {
    const [newReview] = await db("reviews").insert(review).returning("*");
    return newReview;
  }

  /**
   * Updates an existing review in the database.
   * @param {number} id - The ID of the review to update.
   * @param {Review} review - The review data to update.
   * @returns {Promise<Review>} A promise that resolves to the updated review.
   */
  static async update(id: number, review: Review) {
    const [updatedReview] = await db("reviews")
      .where({ id })
      .update(review)
      .returning("*");
    return updatedReview;
  }

  /**
   * Deletes a review from the database.
   * @param {number} id - The ID of the review to delete.
   * @returns {Promise<void>} A promise that resolves when the review has been deleted.
   */
  static async delete(id: number) {
    await db("reviews").where({ id }).del();
  }

  /**
   * Retrieves all reviews for a specific listing.
   * @param {number} listing_id - The ID of the listing to retrieve reviews for.
   * @returns {Promise<Review[]>} A promise that resolves to an array of reviews for the specified listing.
   */
  static async getReviewsByListingId(listing_id: number) {
    return db("reviews")
      .join("users", "reviews.author_id", "users.id")
      .select("reviews.*", "users.name as authorName")
      .where("reviews.listing_id", listing_id);
  }
}

export default ReviewModel;
