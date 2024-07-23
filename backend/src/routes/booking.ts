import { Router } from "express";
import {
  getBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
} from "../controllers/bookings";
import { validateBody, validateParams } from "../middleware/validate";
import {
  createBookingSchema,
  updateBookingSchema,
  bookingIdSchema,
} from "../schemas/booking";
import { wrapAsync } from "../utils/wrapAsync";
import ExpressError from "../utils/ExpressError";

const bookingsRouter = Router();

bookingsRouter.get("/", wrapAsync(getBookings));

bookingsRouter.get(
  "/:id",
  validateParams(bookingIdSchema),
  wrapAsync(getBookingById)
);

bookingsRouter.post(
  "/",
  validateBody(createBookingSchema),
  wrapAsync(createBooking)
);

bookingsRouter.put(
  "/:id",
  validateParams(bookingIdSchema),
  validateBody(updateBookingSchema),
  wrapAsync(updateBooking)
);

bookingsRouter.delete(
  "/:id",
  validateParams(bookingIdSchema),
  wrapAsync(deleteBooking)
);

// All other route requests
bookingsRouter.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

export default bookingsRouter;
