import { Router } from "express";
// import tasksRoutes from "./task";
// import userRoutes from "./user";
// import authRoutes from "./auth";
import listingsRouter from "./listings";
import reviewsRouter from "./reviews";

const router = Router();

// router.use("/auth", authRoutes);
// router.use("/users", userRoutes);
// router.use("/tasks", tasksRoutes);
router.use("/api/listings", listingsRouter);
router.use("/api/reviews", reviewsRouter);

export default router;
