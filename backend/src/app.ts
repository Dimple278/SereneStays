import express from "express";
import dotenv from "dotenv";
import db from "./db";

import cors from "cors";

import listingRouter from "./routes/Listings";

dotenv.config();

const app = express();
app.use(express.json());

// app.set("views", path.join(__dirname, "views"));
// app.set("view engine", "ejs");

// Test the database connection
db.raw("SELECT 1")
  .then(() => {
    console.log("Connected to PostgreSQL database");
  })
  .catch((err) => {
    console.error("Error connecting to PostgreSQL database:", err);
  });

// Sample route to create a listing
// app.get("/testlisting", async (req, res) => {
//   try {
//     let sampleListing = {
//       title: "Chaudhary Villa",
//       description: "By the beach",
//       price: 1200,
//       location: "Kathmandu",
//       country: "Nepal",
//     };

//     const newListing = await ListingModel.save(sampleListing);
//     console.log("Sample listing is saved in db", newListing);
//     res.send("Working");
//   } catch (err) {
//     console.error("Error saving sample listing:", err);
//     res.status(500).send("Error saving sample listing");
//   }
// });

//Index Route
// app.get("/listings", async (req, res) => {
//   const allListings = await Listing.find({});
//   res.render("listings/index.ejs", { allListings });
// });

app.use(cors()); // Enable CORS for all routes
app.use(express.json());

app.use(listingRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
