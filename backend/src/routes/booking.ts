import { Router } from "express";
import {
  getBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
  getBookingsByListingId,
  getBookingsByUserId,
} from "../controllers/bookings";
import { validateBody, validateParams } from "../middleware/validate";
import {
  createBookingSchema,
  updateBookingSchema,
  bookingIdSchema,
} from "../schemas/booking";
import { wrapAsync } from "../utils/wrapAsync";
import { NotFoundError } from "../error/Error";
import { listingIdSchema } from "../schemas/review";
import { authenticate, authorizeBooking } from "../middleware/auth";

const bookingsRouter = Router();

bookingsRouter.get("/", wrapAsync(getBookings));

bookingsRouter.get(
  "/:id",
  validateParams(bookingIdSchema),
  wrapAsync(getBookingById)
);

bookingsRouter.post(
  "/listing/:listing_id",
  authenticate,
  validateBody(createBookingSchema),
  wrapAsync(createBooking)
);

bookingsRouter.put(
  "/:id",
  authenticate,
  validateParams(bookingIdSchema),
  validateBody(updateBookingSchema),
  authorizeBooking,
  wrapAsync(updateBooking)
);

bookingsRouter.delete(
  "/:id",
  authenticate,
  validateParams(bookingIdSchema),
  authorizeBooking,
  wrapAsync(deleteBooking)
);

bookingsRouter.get(
  "/listing/:listing_id",
  // authenticate,
  validateParams(listingIdSchema),
  wrapAsync(getBookingsByListingId)
);

bookingsRouter.get("/user/:user_id", wrapAsync(getBookingsByUserId));

// All other route requests
bookingsRouter.all("*", (req, res, next) => {
  next(new NotFoundError("Page Not Found!"));
});

export default bookingsRouter;
