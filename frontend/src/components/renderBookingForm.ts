import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { navigate } from "../main";
import { IBooking } from "../interfaces/booking";
import { currUser } from "../api/getCurrUser";
import { bookingApi } from "../api/bookings";

export async function renderBookingForm(
  container: HTMLElement,
  ownerId: string,
  listingId: string,
  listingPrice: number
) {
  const bookingFormContainer = document.createElement("div");
  bookingFormContainer.className = "col-8 offset-2 mt-3";

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
      <h4>Your Bookings</h4>
      <div id="userBookingsTable"></div>
    </div>
  `;
    container.appendChild(bookingFormContainer);

    const startDateInput = document.getElementById(
      "startDate"
    ) as HTMLInputElement;
    const endDateInput = document.getElementById("endDate") as HTMLInputElement;
    const totalPriceInput = document.getElementById(
      "totalPrice"
    ) as HTMLInputElement;

    const calculateTotalPrice = () => {
      const startDate = new Date(startDateInput.value);
      const endDate = new Date(endDateInput.value);
      if (startDate && endDate && startDate < endDate) {
        const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const totalPrice = listingPrice * diffDays;
        totalPriceInput.value = `₹ ${totalPrice.toLocaleString("en-IN")}`;
      } else {
        totalPriceInput.value = "Invalid dates";
      }
    };
    const initializeFlatpickr = (unavailableDates: Date[] = []) => {
      flatpickr(startDateInput, {
        enableTime: false,
        dateFormat: "Y-m-d",
        onChange: calculateTotalPrice,
        disable: unavailableDates,
        onDayCreate: (dObj, dStr, fp, dayElem) => {
          const date = dayElem.dateObj;
          const isUnavailable = unavailableDates.some(
            (unavailableDate) => unavailableDate.getTime() === date.getTime()
          );

          if (isUnavailable) {
            dayElem.classList.add("unavailable");
            dayElem.title = "Already booked";
          }
        },
      });

      flatpickr(endDateInput, {
        enableTime: false,
        dateFormat: "Y-m-d",
        onChange: calculateTotalPrice,
        disable: unavailableDates,
        onDayCreate: (dObj, dStr, fp, dayElem) => {
          const date = dayElem.dateObj;
          const isUnavailable = unavailableDates.some(
            (unavailableDate) => unavailableDate.getTime() === date.getTime()
          );

          if (isUnavailable) {
            dayElem.classList.add("unavailable");
            dayElem.title = "Already booked";
          }
        },
      });
    };

    const disableUnavailableDates = async () => {
      try {
        const bookings = await bookingApi.getBookingsForListing(listingId);
        console.log("Bookings:", bookings);

        const unavailableDates: Date[] = bookings.flatMap((booking: any) => {
          const dates = [];
          const currentDate = new Date(booking.startDate);
          const endDate = new Date(booking.endDate);

          while (currentDate <= endDate) {
            dates.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
          }

          return dates;
        });

        console.log("Unavailable dates:", unavailableDates);
        initializeFlatpickr(unavailableDates);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        initializeFlatpickr(); // Initialize flatpickr without unavailable dates
      }
    };

    disableUnavailableDates();

    const bookingForm = document.getElementById(
      "bookingForm"
    ) as HTMLFormElement;
    bookingForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const startDate = startDateInput.value;
      const endDate = endDateInput.value;
      const totalPrice = parseFloat(
        totalPriceInput.value.replace(/[^\d.-]/g, "")
      );

      const token = localStorage.getItem("token");

      try {
        await bookingApi.createBooking(
          listingId,
          {
            start_date: startDate,
            end_date: endDate,
            total_price: totalPrice,
          },
          token!
        );
        alert("Booking successful!");
        await renderUserBookings(listingId);
      } catch (error) {
        console.error("Error creating booking:", error);
        alert("Failed to create booking.");
      }
    });

    // Initially render user bookings
    renderUserBookings(listingId);
  } else {
    const bookings = await bookingApi.getBookingsForListing(listingId);
    console.log("Bookings:", bookings);
    bookingFormContainer.innerHTML = `
      <h4>Bookings for Your Listing</h4>
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
    container.appendChild(bookingFormContainer);
  }
}

async function renderUserBookings(listingId: string) {
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
    console.log("date", userBookings.start_date);
    console.log("end_date", userBookings.end_date);
    console.log("sD", userBookings.startDate);
    console.log("eD", userBookings.endDate);
    console.log("date", new Date(userBookings.startDate));
    console.log("price", userBookings[0].totalPrice);

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
                <button class="btn btn-sm btn-primary edit-booking" data-booking-id="${
                  booking.id
                }">Edit</button>
                <button class="btn btn-sm btn-danger delete-booking" data-booking-id="${
                  booking.id
                }">Delete</button>
              </td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    `;

    // Add event listeners for edit and delete buttons
    userBookingsTable.querySelectorAll(".edit-booking").forEach((button) => {
      button.addEventListener("click", handleEditBooking);
    });

    userBookingsTable.querySelectorAll(".delete-booking").forEach((button) => {
      button.addEventListener("click", handleDeleteBooking);
    });
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    userBookingsTable.innerHTML =
      "<p>Error fetching your bookings. Please try again later.</p>";
  }
}

async function handleEditBooking(event: Event) {
  const bookingId = (event.target as HTMLElement).getAttribute(
    "data-booking-id"
  );
  // Implement edit booking logic here
  console.log("Edit booking:", bookingId);
  // You can open a modal or navigate to an edit page
}

async function handleDeleteBooking(event: Event) {
  const bookingId = (event.target as HTMLElement).getAttribute(
    "data-booking-id"
  );
  if (confirm("Are you sure you want to delete this booking?")) {
    const token = localStorage.getItem("token");
    try {
      await bookingApi.deleteBooking(bookingId!, token!);
      alert("Booking deleted successfully");
      // renderUserBookings();
    } catch (error) {
      console.error("Error deleting booking:", error);
      alert("Failed to delete booking");
    }
  }
}
