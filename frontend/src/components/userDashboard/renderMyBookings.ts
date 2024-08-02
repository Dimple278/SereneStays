import axios from "axios";
import { navigate } from "../../main";

export async function renderMyBookings(container: HTMLElement) {
  const token = localStorage.getItem("token");
  if (!token) {
    container.innerHTML = "<p>You need to log in to view your bookings.</p>";
    return;
  }

  const currUser = JSON.parse(atob(token.split(".")[1]));

  try {
    const response = await axios.get(`/api/bookings/user/${currUser.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const bookings = response.data;

    container.innerHTML = `
      <div class="container mt-4">
        <table class="table table-striped table-hover">
          <thead class="table-dark">
            <tr>
              <th scope="col">Listing Name</th>
              <th scope="col">Check-in</th>
              <th scope="col">Check-out</th>
            </tr>
          </thead>
          <tbody>
            ${bookings
              .map(
                (booking: any) => `
              <tr>
                <td class="listing-name text-primary" data-id="${
                  booking.listingId
                }" style="cursor: pointer;">
                  ${booking.listingTitle || "Unknown Listing"}
                </td>
                <td>${new Date(booking.startDate).toLocaleDateString()}</td>
                <td>${new Date(booking.endDate).toLocaleDateString()}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      </div>
    `;

    container.querySelectorAll(".listing-name").forEach((cell) => {
      cell.addEventListener("click", (event) => {
        const listingId = (event.target as HTMLElement).getAttribute("data-id");
        if (listingId) {
          navigate(`/show/${listingId}`);
        }
      });
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    container.innerHTML =
      "<p>Failed to load bookings. Please try again later.</p>";
  }
}
