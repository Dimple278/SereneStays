import { currUser } from "../api/getCurrUser";
import { bookingApi } from "../api/bookings";

import { renderUserBookings } from "./renderUserBookings";
import { IBooking } from "../interfaces/booking";

import { setupFlatpickr } from "../utils/flatpickerSetup";
import { setupBookingFormHandler } from "../handlers/bookingHandlers";

export async function renderBookingForm(
  container: HTMLElement,
  ownerId: string,
  listingId: string,
  listingPrice: number
) {
  const bookingFormContainer = document.createElement("div");
  bookingFormContainer.className = "col-8 offset-2 mt-3";
  if (!currUser) {
    bookingFormContainer.innerHTML = `
      <h4>Book Your Stay</h4>
      <p>You must be logged in to book a stay.</p>
    `;
    container.appendChild(bookingFormContainer);
    return;
  }
  if (currUser && currUser.id != ownerId) {
    bookingFormContainer.innerHTML = `
      <h4>Book Your Stay</h4>
      <form id="bookingForm">
        <div class="mb-3">
          <label for="startDate" class="form-label">Start Date</label>
          <input type="text" id="startDate" class="form-control" placeholder="Select start date" required>
        </div>
        <div class="mb-3">
          <label for="endDate" class="form-label">End Date</label>
          <input type="text" id="endDate" class="form-control" placeholder="Select end date" required>
        </div>
        <div class="mb-3">
          <label for="totalPrice" class="form-label">Total Price</label>
          <input type="text" id="totalPrice" class="form-control" disabled>
        </div>
        <button type="submit" class="btn btn-success">Book Now</button>
      </form>
      <hr class="my-4">
      <div id="userBookingsContainer">
        <div id="userBookingsTable"></div>
      </div>
    `;
    container.appendChild(bookingFormContainer);

    await setupFlatpickr(
      "startDate",
      "endDate",
      "totalPrice",
      listingId,
      listingPrice
    );
    setupBookingFormHandler(listingId, listingPrice);
    renderUserBookings(listingId, listingPrice);
  } else if (currUser) {
    await renderOwnerBookings(bookingFormContainer, listingId);
    container.appendChild(bookingFormContainer);
  }
}

async function renderOwnerBookings(container: HTMLElement, listingId: string) {
  const bookings = await bookingApi.getBookingsForListing(listingId);
  console.log("Bookings:", bookings);
  container.innerHTML = `
    <h4>Bookings for This Listing</h4>
    <table class="table">
      <thead>
        <tr>
          <th scope="col">Booker Name</th>
          <th scope="col">Start Date</th>
          <th scope="col">End Date</th>
        </tr>
      </thead>
      <tbody>
        ${bookings
          .map(
            (booking: IBooking) => `
          <tr>
            <td>${booking.userName}</td>
            <td>${new Date(booking.startDate).toLocaleDateString()}</td>
            <td>${new Date(booking.endDate).toLocaleDateString()}</td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
    <hr class="my-4">
  `;
}
