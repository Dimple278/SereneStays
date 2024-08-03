import { bookingApi } from "../api/bookings";
import { setupBookingActionHandlers } from "../handlers/bookingHandlers";
// import { setupBookingActionHandlers } from "../handlers/bookingHandlers";
import { IBooking } from "../interfaces/booking";

export async function renderUserBookings(
  listingId: string,
  listingPrice: number
) {
  const token = localStorage.getItem("token");
  const userBookingsTable = document.getElementById("userBookingsTable");
  if (!userBookingsTable) {
    console.error("userBookingsTable element not found");
    return;
  }

  if (!token) {
    console.error("No token found");
    userBookingsTable.innerHTML =
      "<p>You must be logged in to view your bookings.</p>";
    return;
  }

  try {
    console.log("Fetching user bookings for listing...");
    const userBookings = await bookingApi.getUserBookingsForListing(
      token,
      listingId
    );
    console.log("User bookings fetched:", userBookings);

    if (userBookings.length === 0) {
      userBookingsTable.innerHTML =
        "<p>You have no bookings for this listing yet.</p>";
      return;
    }

    userBookingsTable.innerHTML = `
      <table class="table">
        <thead>
          <tr>
            <th scope="col">Start Date</th>
            <th scope="col">End Date</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          ${userBookings
            .map(
              (booking: IBooking) => `
            <tr>
              <td>${new Date(booking.startDate).toLocaleDateString()}</td>
              <td>${new Date(booking.endDate).toLocaleDateString()}</td>
              <td>
                <button class="btn btn-primary edit-booking" data-booking-id="${
                  booking.id
                }"><i class="fa-solid fa-edit"></i></button>
                <button class="btn btn-danger delete-booking" data-booking-id="${
                  booking.id
                }"><i class="fa-solid fa-trash"></i></button>
              </td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    `;

    // Attach event handlers
    setupBookingActionHandlers(listingId, token, listingPrice);
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    userBookingsTable.innerHTML =
      "<p>Error fetching your bookings. Please try again later.</p>";
  }
}
