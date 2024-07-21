// routes/listings.ts
import { Router } from "express";
import {
  getListingById,
  getListings,
  createListing,
  updateListing,
  deleteListing,
} from "../controllers/listings";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../middleware/validate";
import {
  createListingSchema,
  updateListingSchema,
  listingIdSchema,
  querySchema,
} from "../schemas/listing";
import { wrapAsync } from "../utils/wrapAsync";
import ExpressError from "../utils/ExpressError";

const router = Router();

router.get("/api/listings", validateQuery(querySchema), wrapAsync(getListings));

router.get(
  "/api/listings/:id",
  validateParams(listingIdSchema),
  wrapAsync(getListingById)
);

router.post(
  "/api/listings",
  validateBody(createListingSchema),
  wrapAsync(createListing)
);

router.put(
  "/api/listings/:id",
  validateParams(listingIdSchema),
  validateBody(updateListingSchema),
  wrapAsync(updateListing)
);

router.delete(
  "/api/listings/:id",
  validateParams(listingIdSchema),
  wrapAsync(deleteListing)
);

// All other route requests
router.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

export default router;
