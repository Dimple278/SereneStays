import { bookingApi } from "../api/bookings";
import { renderUserBookings } from "../components/renderUserBookings";
import { showEditBookingModal } from "../components/renderEditBookingModal";
import { showCustomConfirm } from "../utils/showCustomConfirm";
import { showCustomAlert } from "../utils/showCustomAlert";

// let isBookingFormHandlerSet = false;
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

  // if (!isBookingFormHandlerSet) {
  bookingForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const startDate = startDateInput.value;
    const endDate = endDateInput.value;
    const totalPrice = parseFloat(
      totalPriceInput.value.replace(/[^\d.-]/g, "")
    );
    const token = localStorage.getItem("token");

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
      showCustomAlert({
        message: "Your booking has been created successfully.",
        type: "success",
      });
      await renderUserBookings(listingId, listingPrice);
    } catch (error) {
      console.error("Error creating booking:", error);
      showCustomAlert({
        message: "Failed to create booking. Please try again.",
        type: "danger",
      });
    }
  });

  // isBookingFormHandlerSet = true;
  // }
}

export function setupBookingActionHandlers(
  bookingId: string,
  listingId: string,
  token: string,
  listingPrice: number
) {
  const editButton = document.querySelector(
    `.edit-booking[data-booking-id="${bookingId}"]`
  );
  const deleteButton = document.querySelector(
    `.delete-booking[data-booking-id="${bookingId}"]`
  );

  if (editButton) {
    editButton.addEventListener("click", async () => {
      const bookingData = await bookingApi.getBookingById(bookingId);
      showEditBookingModal(bookingId, bookingData, listingId, listingPrice);
    });
  }

  if (deleteButton) {
    deleteButton.addEventListener("click", async () => {
      showCustomConfirm({
        message: "Are you sure you want to delete this booking?",
        onConfirm: async () => {
          await bookingApi.deleteBooking(bookingId, token);
          showCustomAlert({
            message: "Booking deleted successfully!",
            type: "success",
          });
          await renderUserBookings(listingId, listingPrice);
        },
      });
    });
  }
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
        showCustomAlert({
          message: "Booking updated successfully.",
          type: "success",
        });
        await renderUserBookings(listingId, listingPrice);
        const editBookingModalElement =
          document.getElementById("editBookingModal");
        if (editBookingModalElement) {
          editBookingModalElement.setAttribute("data-bs-dismiss", "modal");
          editBookingModalElement.click();
        }
      } catch (error) {
        console.error("Error updating booking:", error);
        showCustomAlert({
          message: "Failed to update booking. Please try again.",
          type: "danger",
        });
      }
    });
    isEditBookingFormHandlerSet = true;
  }
}
