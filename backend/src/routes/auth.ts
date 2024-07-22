// src/routes/authRoutes.ts
import { Router } from "express";
import { wrapAsync } from "../utils/wrapAsync";
import { login, logout, getCurrentUser } from "../controllers/auth";

const router = Router();

// Login route
router.post("/login", wrapAsync(login));

// Logout route
router.post("/logout", logout);

// Route to get the current user
router.get("/current-user", wrapAsync(getCurrentUser));

export default router;
