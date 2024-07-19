import { Router } from "express";
import ListingModel from "../models/Listing";

const router = Router();

// Index Route
router.get("/listings", async (req, res) => {
  try {
    const allListings = await ListingModel.findAll();
    res.json(allListings);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// New Route - Since this route is for rendering a form, it might not be necessary in an API context
router.get("/listings/new", (req, res) => {
  // Typically, we don't need a backend route for rendering a new form in an API context
  res.status(200).send("New listing form");
});

// Show Route
router.get("/listings/:id", async (req, res) => {
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
router.post("/listings", async (req, res) => {
  try {
    const newListing = await ListingModel.create(req.body);
    res.status(201).json(newListing);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Delete Route
router.delete("/listings/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await ListingModel.delete(parseInt(id));
    res.json("Deleted successfully");
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Edit Route
router.get("/listings/:id/edit", async (req, res) => {
  let { id } = req.params;
  const listing = await ListingModel.findById(parseInt(id));
  res.json({ listing });
});

//update route
router.put("/listings/:id", async (req, res) => {
  const updatedListing = await ListingModel.update(
    Number(req.params.id),
    req.body
  );
  res.json(updatedListing);
});

//delete route
router.delete("/listings/:id", async (req, res) => {
  const id = Number(req.params.id);
  await ListingModel.delete(id);
  res.redirect("/listings");
});

export default router;
