import { Router } from "express";
import reviewsRouter from "./reviews";
import userRouter from "./users";
import bookingsRouter from "./booking";
import authRouter from "./auth";
import listingsRouter from "./Listings";

const router = Router();

router.use("/api/listings", listingsRouter);
router.use("/api/reviews", reviewsRouter);
router.use("/api/users", userRouter);
router.use("/api/auth", authRouter);
router.use("/api/bookings", bookingsRouter);

export default router;
