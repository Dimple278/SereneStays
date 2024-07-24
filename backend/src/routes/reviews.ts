import { Router } from "express";
import {
  getReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
  getReviewsByListingId,
} from "../controllers/reviews";
import { validateBody, validateParams } from "../middleware/validate";
import {
  createReviewSchema,
  updateReviewSchema,
  reviewIdSchema,
} from "../schemas/review";
import { wrapAsync } from "../utils/wrapAsync";

import { authenticate } from "../middleware/auth";
import { NotFoundError } from "../error/Error";
import { listingIdSchema } from "../schemas/review";

const reviewsRouter = Router();

reviewsRouter.get(
  "/",
  // authenticate,
  wrapAsync(getReviews)
);

reviewsRouter.get(
  "/:id",
  validateParams(reviewIdSchema),
  wrapAsync(getReviewById)
);

reviewsRouter.post(
  "/",
  validateBody(createReviewSchema),
  wrapAsync(createReview)
);

reviewsRouter.put(
  "/:id",
  validateParams(reviewIdSchema),
  validateBody(updateReviewSchema),
  wrapAsync(updateReview)
);

reviewsRouter.delete(
  "/:id",
  validateParams(reviewIdSchema),
  wrapAsync(deleteReview)
);

reviewsRouter.get(
  "/listing/:listing_id",
  validateParams(listingIdSchema),
  wrapAsync(getReviewsByListingId)
);

// All other route requests
reviewsRouter.all("*", (req, res, next) => {
  next(new NotFoundError("Page Not Found!"));
});

export default reviewsRouter;
