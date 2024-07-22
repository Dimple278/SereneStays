import { Router } from "express";
import {
  getReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
} from "../controllers/reviews";
import { validateBody, validateParams } from "../middleware/validate";
import {
  createReviewSchema,
  updateReviewSchema,
  reviewIdSchema,
} from "../schemas/review";
import { wrapAsync } from "../utils/wrapAsync";
import ExpressError from "../utils/ExpressError";

const reviewsRouter = Router();

reviewsRouter.get("/", wrapAsync(getReviews));

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

// All other route requests
reviewsRouter.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

export default reviewsRouter;
