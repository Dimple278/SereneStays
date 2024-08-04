import { bookingApi } from "../api/bookings";
import { setupBookingActionHandlers } from "../handlers/bookingHandlers";
import { IBooking } from "../interfaces/booking";
import { getCurrUser } from "../api/getCurrUser"; // Import the getCurrUser function

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
      "<p>You must be logged in to view bookings.</p>";
    return;
  }

  try {
    const currUser = await getCurrUser(); // Get the current user
    const isSuperAdmin = currUser && currUser.role === "superadmin";
    let bookings;
    if (isSuperAdmin) {
      bookings = await bookingApi.getBookingsForListing(listingId);
    } else {
      bookings = await bookingApi.getUserBookingsForListing(token, listingId);
    }

    if (bookings.length === 0) {
      userBookingsTable.innerHTML = isSuperAdmin
        ? "<p>There are no bookings for this listing yet.</p>"
        : "<p>You have no bookings for this listing yet.</p>";
      return;
    }

    const tableTitle = isSuperAdmin
      ? "All Bookings for this listing:"
      : "Your Bookings for this listing:";

    userBookingsTable.innerHTML = `
      <h4>${tableTitle}</h4>
      <table class="table">
        <thead>
          <tr>
            <th scope="col">Start Date</th>
            <th scope="col">End Date</th>
            ${isSuperAdmin ? '<th scope="col">User</th>' : ""}
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          ${bookings
            .map(
              (booking: IBooking) => `
            <tr>
              <td>${new Date(booking.startDate).toLocaleDateString()}</td>
              <td>${new Date(booking.endDate).toLocaleDateString()}</td>
              ${isSuperAdmin ? `<td>${booking.userName}</td>` : ""}
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

    // Attach event handlers for each booking
    bookings.forEach((booking: IBooking) => {
      if (booking.id) {
        setupBookingActionHandlers(
          booking.id.toString(),
          listingId,
          token,
          listingPrice
        );
      } else {
        console.error("Booking ID is undefined or null", booking);
      }
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    userBookingsTable.innerHTML =
      "<p>Unable to fetch bookings at this time.</p>";
  }
}
