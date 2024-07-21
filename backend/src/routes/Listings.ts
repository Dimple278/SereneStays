import { Router } from "express";
import ListingModel from "../models/Listing";
import { wrapAsync } from "../utils/wrapAsync";
import ExpressError from "../utils/ExpressError";

const router = Router();

// Index Route
router.get(
  "/api/listings",
  wrapAsync(async (req, res) => {
    const allListings = await ListingModel.findAll();
    res.json(allListings);
  })
);

//Get listing by id Route(Show Route)
router.get(
  "/api/listings/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await ListingModel.findById(parseInt(id));
    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }
    res.json(listing);
  })
);

//Create route
router.post(
  "/api/listings",
  wrapAsync(async (req, res, next) => {
    const newListing = await ListingModel.save(req.body);
    res.status(201).json(newListing);
  })
);

// update route
router.put(
  "/api/listings/:id",
  wrapAsync(async (req, res) => {
    const updatedListing = await ListingModel.update(
      Number(req.params.id),
      req.body
    );
    res.json(updatedListing);
  })
);

//delete route
router.delete(
  "/api/listings/:id",
  wrapAsync(async (req, res) => {
    const id = Number(req.params.id);
    await ListingModel.delete(id);
    res.redirect("/api/listings");
  })
);

//all other route req ---------
router.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

export default router;
