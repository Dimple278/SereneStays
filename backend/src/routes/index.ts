import { Router } from "express";
// import tasksRoutes from "./task";
// import userRoutes from "./user";
// import authRoutes from "./auth";
import listingsRouter from "./listings";
import reviewsRouter from "./reviews";
import userRouter from "./users";

const router = Router();

router.use("/api/listings", listingsRouter);
router.use("/api/reviews", reviewsRouter);
router.use("/api/users", userRouter);

export default router;
