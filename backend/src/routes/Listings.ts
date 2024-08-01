// routes/listings.ts
import { Router } from "express";
import {
  getListingById,
  getListings,
  createListing,
  updateListing,
  deleteListing,
  filterListings,
  searchListings,
  getListingsByUserId,
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
import { upload } from "../../cloudinary";

import { authenticate, authorize } from "../middleware/auth";
import { NotFoundError } from "../error/NotFoundError";

const listingsRouter = Router();
listingsRouter.get(
  "/filter",
  validateQuery(querySchema),
  wrapAsync(filterListings)
);

// Search route
listingsRouter.get("/search", wrapAsync(searchListings));

listingsRouter.get("/", validateQuery(querySchema), wrapAsync(getListings));

listingsRouter.get(
  "/:id",
  validateParams(listingIdSchema),
  wrapAsync(getListingById)
);

listingsRouter.post(
  "/",
  upload.array("images"),
  authenticate,
  // authorize,
  validateBody(createListingSchema),
  wrapAsync(createListing)
);

listingsRouter.put(
  "/:id",
  upload.array("images"),
  authenticate,
  authorize,
  validateParams(listingIdSchema),
  validateBody(updateListingSchema),
  wrapAsync(updateListing)
);

listingsRouter.delete(
  "/:id",
  authenticate,
  authorize,
  validateParams(listingIdSchema),
  wrapAsync(deleteListing)
);

listingsRouter.get(
  "/users/:userId",
  authenticate,
  wrapAsync(getListingsByUserId)
);

// All other route requests
listingsRouter.all("*", (req, res, next) => {
  next(new NotFoundError("Page Not Found!"));
});

export default listingsRouter;
