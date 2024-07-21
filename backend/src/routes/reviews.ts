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

const router = Router();

router.get("/api/reviews", wrapAsync(getReviews));

router.get(
  "/api/reviews/:id",
  validateParams(reviewIdSchema),
  wrapAsync(getReviewById)
);

router.post(
  "/api/reviews",
  validateBody(createReviewSchema),
  wrapAsync(createReview)
);

router.put(
  "/api/reviews/:id",
  validateParams(reviewIdSchema),
  validateBody(updateReviewSchema),
  wrapAsync(updateReview)
);

router.delete(
  "/api/reviews/:id",
  validateParams(reviewIdSchema),
  wrapAsync(deleteReview)
);

// All other route requests
router.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

export default router;
