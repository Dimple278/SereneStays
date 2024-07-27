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
import { NotFoundError } from "../error/Error";
import { upload } from "../../cloudinary";

import { authenticate } from "../middleware/auth";

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
  // authenticate,
  validateBody(createListingSchema),
  wrapAsync(createListing)
);

listingsRouter.put(
  "/:id",
  upload.array("images"),
  validateParams(listingIdSchema),
  validateBody(updateListingSchema),
  wrapAsync(updateListing)
);

listingsRouter.delete(
  "/:id",
  validateParams(listingIdSchema),
  wrapAsync(deleteListing)
);

// All other route requests
listingsRouter.all("*", (req, res, next) => {
  next(new NotFoundError("Page Not Found!"));
});

export default listingsRouter;
