// models/Review.ts
import db from "../db";

interface Review {
  id?: number;
  comment: string;
  rating: number;
  createdAt?: Date;
}

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
}

export default ReviewModel;
