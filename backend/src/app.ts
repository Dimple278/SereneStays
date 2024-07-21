import express from "express";
import dotenv from "dotenv";
import db from "./db";

import cors from "cors";

// import listingRouter from "./routes/listings";
import listingRouter from "./routes/listings";
import reviewRouter from "./routes/reviews";
import errorHandler from "./middleware/errorHandler";

dotenv.config();

// Test the database connection
db.raw("SELECT 1")
  .then(() => {
    console.log("Connected to PostgreSQL database");
  })
  .catch((err) => {
    console.error("Error connecting to PostgreSQL database:", err);
  });

const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(cors()); // Enable CORS for all routes
app.use(express.json());

app.use(reviewRouter);
app.use(listingRouter);

// Custom error handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
