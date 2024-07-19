import { Router } from "express";
import ListingModel from "../models/Listing";

const router = Router();

// Index Route
router.get("/api/listings", async (req, res) => {
  try {
    const allListings = await ListingModel.findAll();
    res.json(allListings);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Show Route
router.get("/api/listings/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const listing = await ListingModel.findById(parseInt(id));
    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }
    res.json(listing);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Create Route
router.post("/api/listings", async (req, res) => {
  try {
    const newListing = await ListingModel.create(req.body);
    res.status(201).json(newListing);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//update route
router.put("/api/listings/:id", async (req, res) => {
  const updatedListing = await ListingModel.update(
    Number(req.params.id),
    req.body
  );
  res.json(updatedListing);
});

//delete route
router.delete("/api/listings/:id", async (req, res) => {
  const id = Number(req.params.id);
  await ListingModel.delete(id);
  res.redirect("/api/listings");
});

export default router;
