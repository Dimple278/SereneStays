// models/Review.ts
import db from "../database/db";
import { Review } from "../interface/review";

class ReviewModel {
  static async findAll() {
    return db("reviews").select("*");
  }

  static async findById(id: number) {
    return db("reviews").where({ id }).first();
  }

  static async save(review: Review) {
    const [newReview] = await db("reviews").insert(review).returning("*");
    return newReview;
  }

  static async update(id: number, review: Review) {
    const [updatedReview] = await db("reviews")
      .where({ id })
      .update(review)
      .returning("*");
    return updatedReview;
  }

  static async delete(id: number) {
    await db("reviews").where({ id }).del();
  }

  static async getReviewsByListingId(listing_id: number) {
    return db("reviews")
      .join("users", "reviews.author_id", "users.id")
      .select("reviews.*", "users.name as authorName")
      .where("reviews.listing_id", listing_id);
  }
}

export default ReviewModel;
