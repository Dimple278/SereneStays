import { Router } from "express";
import { wrapAsync } from "../utils/wrapAsync";
import ExpressError from "../utils/ExpressError";
import {
  getListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
} from "../controllers/listings";
import {
  validateCreateListing,
  validateUpdateListing,
  validateListingId,
  validateQuery,
} from "../middleware/validate";

const router = Router();

// Index Route
router.get("/api/listings", validateQuery, wrapAsync(getListings));

// Get listing by id Route (Show Route)
router.get("/api/listings/:id", validateListingId, wrapAsync(getListingById));

// Create route
router.post("/api/listings", validateCreateListing, wrapAsync(createListing));

// Update route
router.put(
  "/api/listings/:id",
  validateListingId,
  validateUpdateListing,
  wrapAsync(updateListing)
);

// Delete route
router.delete("/api/listings/:id", validateListingId, wrapAsync(deleteListing));

// All other route requests
router.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

export default router;
