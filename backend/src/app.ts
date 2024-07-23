import express from "express";
import dotenv from "dotenv";
import db from "./db";

import session from "express-session";
import cookieParser from "cookie-parser";
import flash from "connect-flash";
import cors from "cors";

import router from "./routes";

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

app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "defaultSecret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use(flash());

app.use(express.urlencoded({ extended: true }));

app.use(cors()); // Enable CORS for all routes
app.use(express.json());

// Global middleware for flash messages
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// app.use(reviewRouter);
app.use(router);

// Custom error handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
