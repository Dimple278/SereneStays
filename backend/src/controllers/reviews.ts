import { Request, Response } from "express";
import Review from "../models/Review";
import { NotFoundError } from "../error/Error";

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

export const createReview = async (req: Request, res: Response) => {
  const newReview = await Review.save(req.body);
  res.status(201).json(newReview);
};

export const updateReview = async (req: Request, res: Response) => {
  const { id } = req.params;
  const review = await Review.findById(parseInt(id));
  if (!review) {
    throw new NotFoundError("Review not found");
  }
  const updatedReview = await Review.update(Number(req.params.id), req.body);
  res.json(updatedReview);
};

export const deleteReview = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const review = await Review.findById(id);
  if (!review) {
    throw new NotFoundError("Review not found");
  }
  await Review.delete(id);
  res.json(review);
};
