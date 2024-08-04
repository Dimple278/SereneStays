import { bookingApi, fetchBookings } from "../../api/bookings";
import { setupPagination } from "../../handlers/paginationHandler";
import { IBooking } from "../../interfaces/booking";
import { navigate } from "../../main";
import { showCustomAlert } from "../../utils/showCustomAlert";
import { showCustomConfirm } from "../../utils/showCustomConfirm";

export async function renderAllBookings(
  container: HTMLElement,
  page: number = 1
) {
  container.innerHTML = "";
  const limit = 10;

  try {
    const { bookings, totalCount } = await fetchBookings(page, limit);

    const table = document.createElement("table");
    table.className = "table table-hover table-striped";

    const thead = document.createElement("thead");
    thead.innerHTML = `
      <tr>
        <th>ID</th>
        <th>User Name</th>
        <th>Listing Name</th>
        <th>Start Date</th>
        <th>End Date</th>
      </tr>
    `;

    const tbody = document.createElement("tbody");

    bookings.forEach((booking: IBooking) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${booking.id}</td>
        <td>${booking.userName}</td>
        <td class="booking-listing-name" data-id="${
          booking.listingId
        }" style="cursor:pointer;">${booking.listingTitle}</td>
        <td>${new Date(booking.startDate).toLocaleDateString()}</td>
        <td>${new Date(booking.endDate).toLocaleDateString()}</td>
      `;
      tbody.appendChild(row);
    });

    table.appendChild(thead);
    table.appendChild(tbody);

    const tableContainer = document.createElement("div");
    tableContainer.className = "table-responsive";
    tableContainer.appendChild(table);

    container.appendChild(tableContainer);

    // Add event listeners
    setupBookingActionListeners(container);

    // Setup pagination
    setupPagination(container, totalCount, page, (newPage) => {
      renderAllBookings(container, newPage);
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    container.innerHTML =
      '<p class="text-danger">Failed to load bookings. Please try again later.</p>';
  }
}

function setupBookingActionListeners(container: HTMLElement) {
  // Listing name click event
  container.querySelectorAll(".booking-listing-name").forEach((name) => {
    name.addEventListener("click", (event) => {
      const id = (event.currentTarget as HTMLElement).getAttribute("data-id");
      navigate(`/show/${id}`);
    });
  });

  // // Edit booking event
  // container.querySelectorAll(".edit-booking").forEach((button) => {
  //   button.addEventListener("click", (event) => {
  //     const target = event.target as HTMLButtonElement;
  //     const bookingId = parseInt(
  //       target.closest("button")!.dataset.id as string,
  //       10
  //     );
  //     navigate(`/bookings/edit/${bookingId}`);
  //   });
  // });

  // // Delete booking event
  // container.querySelectorAll(".delete-booking").forEach((button) => {
  //   button.addEventListener("click", async (event) => {
  //     const target = event.target as HTMLButtonElement;
  //     const bookingId = target.closest("button")!.dataset.id as string;
  //     const token = localStorage.getItem("token") as string;
  //     showCustomConfirm({
  //       message: "Are you sure you want to delete this booking ?",
  //       onConfirm: async () => {
  //         await bookingApi.deleteBooking(bookingId, token);
  //         showCustomAlert({
  //           message: "Booking deleted successfully!",
  //           type: "success",
  //         });
  //       },
  //     });
  //   });
  // });
}
