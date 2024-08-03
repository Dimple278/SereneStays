import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { bookingApi } from "../api/bookings";

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

    const flatpickrConfig = {
      enableTime: false,
      dateFormat: "Y-m-d",
      onChange: calculateTotalPrice,
      disable: unavailableDates,
      onDayCreate: (
        _dObj: any,
        dStr: any,
        fp: any,
        dayElem: {
          dateObj: any;
          classList: { add: (arg0: string) => void };
          title: string;
        }
      ) => {
        const date = dayElem.dateObj;
        const isUnavailable = unavailableDates.some(
          (unavailableDate) => unavailableDate.getTime() === date.getTime()
        );

        if (isUnavailable) {
          dayElem.classList.add("unavailable");
          dayElem.title = "Already booked";
        }
      },
    };

    flatpickr(startDateInput, flatpickrConfig);
    flatpickr(endDateInput, flatpickrConfig);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    // Initialize flatpickr without unavailable dates
    flatpickr(startDateInput, { onChange: calculateTotalPrice });
    flatpickr(endDateInput, { onChange: calculateTotalPrice });
  }
}
