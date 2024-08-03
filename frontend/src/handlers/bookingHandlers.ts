import { bookingApi } from "../api/bookings";
import { renderUserBookings } from "../components/renderUserBookings";
import { showEditBookingModal } from "../components/renderEditBookingModal";

let isBookingFormHandlerSet = false;
let isEditBookingFormHandlerSet = false;

export function setupBookingFormHandler(
  listingId: string,
  listingPrice: number
) {
  const bookingForm = document.getElementById("bookingForm") as HTMLFormElement;
  const startDateInput = document.getElementById(
    "startDate"
  ) as HTMLInputElement;
  const endDateInput = document.getElementById("endDate") as HTMLInputElement;
  const totalPriceInput = document.getElementById(
    "totalPrice"
  ) as HTMLInputElement;

  if (!isBookingFormHandlerSet) {
    bookingForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      console.log("Form submitted");

      const startDate = startDateInput.value;
      const endDate = endDateInput.value;
      const totalPrice = parseFloat(
        totalPriceInput.value.replace(/[^\d.-]/g, "")
      );
      const token = localStorage.getItem("token");
      console.log("Start Date:", startDate);
      console.log("End Date:", endDate);
      console.log("Total Price:", totalPrice);

      try {
        const response = await bookingApi.createBooking(
          listingId,
          {
            start_date: startDate,
            end_date: endDate,
            total_price: totalPrice,
          },
          token!
        );

        console.log("Booking response:", response);

        alert("Booking successful!");
        await renderUserBookings(listingId, listingPrice);
      } catch (error) {
        console.error("Error creating booking:", error);
        alert("Failed to create booking.");
      }
    });

    isBookingFormHandlerSet = true;
  }
}

export function setupBookingActionHandlers(
  listingId: string,
  token: string,
  listingPrice: number
) {
  document.querySelectorAll(".edit-booking").forEach((button) => {
    button.addEventListener("click", async (event) => {
      const bookingId = (event.target as HTMLElement).getAttribute(
        "data-booking-id"
      );
      if (bookingId) {
        const bookingData = await bookingApi.getBookingById(bookingId);
        showEditBookingModal(bookingId, bookingData, listingId, listingPrice);
      }
    });
  });

  document.querySelectorAll(".delete-booking").forEach((button) => {
    button.addEventListener("click", async (event) => {
      const bookingId = (event.target as HTMLElement).getAttribute(
        "data-booking-id"
      );
      if (
        bookingId &&
        confirm("Are you sure you want to delete this booking?")
      ) {
        await bookingApi.deleteBooking(bookingId, token);
        await renderUserBookings(listingId, listingPrice);
      }
    });
  });
}

export function setupEditBookingFormHandler(
  bookingId: string,
  listingId: string,

  listingPrice: number
) {
  const editBookingForm = document.getElementById(
    "editBookingForm"
  ) as HTMLFormElement;
  const editStartDateInput = document.getElementById(
    "editStartDate"
  ) as HTMLInputElement;
  const editEndDateInput = document.getElementById(
    "editEndDate"
  ) as HTMLInputElement;
  const editTotalPriceInput = document.getElementById(
    "editTotalPrice"
  ) as HTMLInputElement;

  if (!isEditBookingFormHandlerSet) {
    editBookingForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const startDate = editStartDateInput.value;
      const endDate = editEndDateInput.value;

      const totalPrice = parseFloat(
        editTotalPriceInput.value.replace(/[^\d.-]/g, "")
      );
      const token = localStorage.getItem("token");
      try {
        await bookingApi.updateBooking(
          bookingId,
          {
            start_date: startDate,
            end_date: endDate,
            total_price: totalPrice,
          },
          token!
        );
        alert("Booking updated successfully!");
        await renderUserBookings(listingId, listingPrice);
        const editBookingModalElement =
          document.getElementById("editBookingModal");
        if (editBookingModalElement) {
          editBookingModalElement.setAttribute("data-bs-dismiss", "modal");
          editBookingModalElement.click();
        }
      } catch (error) {
        console.error("Error updating booking:", error);
        alert("Failed to update booking.");
      }
    });
    isEditBookingFormHandlerSet = true;
  }
}
