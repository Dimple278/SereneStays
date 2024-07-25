import { Router } from "express";
import {
  getBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
  getBookingsByListingId,
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

bookingsRouter.get(
  "/listing/:listing_id",
  validateParams(listingIdSchema),
  wrapAsync(getBookingsByListingId)
);

// All other route requests
bookingsRouter.all("*", (req, res, next) => {
  next(new NotFoundError("Page Not Found!"));
});

export default bookingsRouter;
