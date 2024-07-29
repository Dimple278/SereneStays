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

import { authenticate, authorizeReviewOwner } from "../middleware/auth";
import { NotFoundError } from "../error/Error";
import { listingIdSchema } from "../schemas/review";

const reviewsRouter = Router();

reviewsRouter.get("/", wrapAsync(getReviews));

reviewsRouter.get(
  "/:id",
  validateParams(reviewIdSchema),
  wrapAsync(getReviewById)
);

reviewsRouter.put(
  "/:id",
  authenticate,
  authorizeReviewOwner,
  // validateParams(reviewIdSchema),
  validateBody(updateReviewSchema),
  wrapAsync(updateReview)
);

reviewsRouter.delete(
  "/:id",
  authenticate,
  authorizeReviewOwner,
  validateParams(reviewIdSchema),
  wrapAsync(deleteReview)
);

reviewsRouter.get(
  "/listing/:listing_id",
  validateParams(listingIdSchema),
  wrapAsync(getReviewsByListingId)
);

reviewsRouter.post(
  "/listing/:listing_id/",
  authenticate,
  validateBody(createReviewSchema),
  wrapAsync(createReview)
);

// All other route requests
reviewsRouter.all("*", (req, res, next) => {
  next(new NotFoundError("Page Not Found!"));
});

export default reviewsRouter;
