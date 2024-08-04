import flatpickr from "flatpickr";
import { bookingApi } from "../api/bookings";
import "flatpickr/dist/flatpickr.min.css";
import { Instance, DayElement } from "flatpickr/dist/types/instance";
import { showCustomAlert } from "./showCustomAlert";
import { IBooking } from "../interfaces/booking";

/**
 * Sets up the flatpickr date pickers for booking dates and calculates the total price.
 *
 * @param {string} startDateId - The ID of the start date input element.
 * @param {string} endDateId - The ID of the end date input element.
 * @param {string} totalPriceId - The ID of the total price input element.
 * @param {string} listingId - The ID of the listing.
 * @param {number} listingPrice - The price per day of the listing.
 */
export async function setupFlatpickr(
  startDateId: string,
  endDateId: string,
  totalPriceId: string,
  listingId: string,
  listingPrice: number
) {
  const startDateInput = document.getElementById(
    startDateId
  ) as HTMLInputElement;
  const endDateInput = document.getElementById(endDateId) as HTMLInputElement;
  const totalPriceInput = document.getElementById(
    totalPriceId
  ) as HTMLInputElement;

  /**
   * Calculates the total price based on the selected start and end dates.
   */
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

  try {
    // Fetch existing bookings for the listing
    const bookings = await bookingApi.getBookingsForListing(listingId);
    console.log("Bookings:", bookings);

    // Create an array of booked date ranges
    const bookedRanges = bookings.map((booking: IBooking) => ({
      from: new Date(booking.startDate),
      to: new Date(booking.endDate),
    }));

    /**
     * Checks if a date is booked.
     *
     * @param {Date} date - The date to check.
     * @returns {boolean} True if the date is booked, false otherwise.
     */
    const isDateBooked = (date: Date) => {
      return bookedRanges.some(
        (range: { from: Date; to: Date }) =>
          date >= range.from && date <= range.to
      );
    };

    /**
     * Checks if a date range is available.
     *
     * @param {Date} start - The start date of the range.
     * @param {Date} end - The end date of the range.
     * @returns {boolean} True if the range is available, false otherwise.
     */
    const isRangeAvailable = (start: Date, end: Date) => {
      let currentDate = new Date(start);
      while (currentDate <= end) {
        if (isDateBooked(currentDate)) {
          return false;
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
      return true;
    };

    let startPicker: Instance;
    let endPicker: Instance;

    const commonConfig: flatpickr.Options.Options = {
      enableTime: false,
      dateFormat: "Y-m-d",
      minDate: "today",
      disable: [isDateBooked],
      /**
       * Adds a tooltip to disabled days in the calendar.
       */
      onDayCreate: function (
        dObj: Date[],
        dStr: string,
        fp: Instance,
        dayElem: DayElement
      ) {
        if (dayElem.classList.contains("flatpickr-disabled")) {
          if (dayElem.dateObj < fp.config.minDate!) {
            dayElem.title = "Invalid date";
          } else if (isDateBooked(dayElem.dateObj)) {
            dayElem.title = "Already booked";
          }
        }
      },
    };

    // Initialize the start date picker
    startPicker = flatpickr(startDateInput, {
      ...commonConfig,
      onChange: (selectedDates: Date[]) => {
        if (selectedDates[0]) {
          endPicker.set("minDate", selectedDates[0]);
        }
        validateDateRange();
      },
    });

    // Initialize the end date picker
    endPicker = flatpickr(endDateInput, {
      ...commonConfig,
      onChange: (selectedDates: Date[]) => {
        if (selectedDates[0]) {
          startPicker.set("maxDate", selectedDates[0]);
        }
        validateDateRange();
      },
    });

    /**
     * Validates the selected date range and updates the total price.
     */
    function validateDateRange() {
      const startDate = startPicker.selectedDates[0];
      const endDate = endPicker.selectedDates[0];

      if (startDate && endDate) {
        if (!isRangeAvailable(startDate, endDate)) {
          showCustomAlert({
            message:
              "Selected range includes booked dates. Please choose different dates.",
            type: "danger",
          });
          startPicker.clear();
          endPicker.clear();
        } else {
          calculateTotalPrice();
        }
      }
    }
  } catch (error) {
    console.error("Error fetching bookings:", error);
    // Initialize flatpickr without unavailable dates
    flatpickr(startDateInput, { onChange: calculateTotalPrice });
    flatpickr(endDateInput, { onChange: calculateTotalPrice });
  }
}
