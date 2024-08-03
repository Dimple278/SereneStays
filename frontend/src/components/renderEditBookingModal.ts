import { IBooking } from "../interfaces/booking";
import { setupEditBookingFormHandler } from "../handlers/bookingHandlers";
import { setupFlatpickr } from "../utils/flatpickerSetup";
import { renderUserBookings } from "./renderUserBookings";
import Modal from "bootstrap/js/dist/modal";

export async function showEditBookingModal(
  bookingId: string,
  bookingData: IBooking,
  listingId: string,
  listingPrice: number
) {
  const modalHtml = `
      <div class="modal fade" id="editBookingModal" tabindex="-1" aria-labelledby="editBookingModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="editBookingModalLabel">Edit Booking</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <form id="editBookingForm">
                <div class="mb-3">
                  <label for="editStartDate" class="form-label">Start Date</label>
                  <input type="text" id="editStartDate" class="form-control" value="${new Date(
                    bookingData.startDate
                  ).toLocaleDateString()}" required>
                </div>
                <div class="mb-3">
                  <label for="editEndDate" class="form-label">End Date</label>
                  <input type="text" id="editEndDate" class="form-control" value="${new Date(
                    bookingData.endDate
                  ).toLocaleDateString()}" required>
                </div>
                <div class="mb-3">
                  <label for="editTotalPrice" class="form-label">Total Price</label>
                  <input type="text" id="editTotalPrice" class="form-control" value="${
                    bookingData.totalPrice
                  }" disabled>
                </div>
                <button type="submit" class="btn btn-primary">Save changes</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    `;

  document.body.insertAdjacentHTML("beforeend", modalHtml);
  const editBookingModal = new Modal(
    document.getElementById("editBookingModal")!
  );
  editBookingModal.show();
  setupFlatpickr(
    "editStartDate",
    "editEndDate",
    "editTotalPrice",
    listingId,
    listingPrice
  );

  setupEditBookingFormHandler(bookingId, listingId, listingPrice);
  renderUserBookings(listingId, listingPrice);
}
