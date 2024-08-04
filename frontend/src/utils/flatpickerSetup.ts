import flatpickr from "flatpickr";
import { bookingApi } from "../api/bookings";
import "flatpickr/dist/flatpickr.min.css";
import { Instance, DayElement } from "flatpickr/dist/types/instance";
import { showCustomAlert } from "./showCustomAlert";

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
    const bookings = await bookingApi.getBookingsForListing(listingId);
    console.log("Bookings:", bookings);

    const bookedRanges = bookings.map((booking: any) => ({
      from: new Date(booking.startDate),
      to: new Date(booking.endDate),
    }));

    const isDateBooked = (date: Date) => {
      return bookedRanges.some(
        (range: any) => date >= range.from && date <= range.to
      );
    };

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

    startPicker = flatpickr(startDateInput, {
      ...commonConfig,
      onChange: (selectedDates: Date[]) => {
        if (selectedDates[0]) {
          endPicker.set("minDate", selectedDates[0]);
        }
        validateDateRange();
      },
    });

    endPicker = flatpickr(endDateInput, {
      ...commonConfig,
      onChange: (selectedDates: Date[]) => {
        if (selectedDates[0]) {
          startPicker.set("maxDate", selectedDates[0]);
        }
        validateDateRange();
      },
    });

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
