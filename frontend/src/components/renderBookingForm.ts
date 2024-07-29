import axios from "axios";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { navigate } from "../main";

export async function renderBookingForm(
  container: HTMLElement,
  listingId: string,
  listingPrice: number
) {
  const bookingFormContainer = document.createElement("div");
  bookingFormContainer.className = "col-8 offset-2 mt-3";
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
      const bookingsResponse = await axios.get(
        `/api/bookings/listing/${listingId}`
      );
      console.log("Bookings:", bookingsResponse.data);
      const bookings = bookingsResponse.data;

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

  const bookingForm = document.getElementById("bookingForm") as HTMLFormElement;
  bookingForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const startDate = startDateInput.value;
    const endDate = endDateInput.value;
    const totalPrice = parseFloat(
      totalPriceInput.value.replace(/[^\d.-]/g, "")
    );

    const token = localStorage.getItem("token");

    try {
      await axios.post(
        `/api/bookings/listing/${listingId}`,
        {
          start_date: startDate,
          end_date: endDate,
          total_price: totalPrice,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Booking successful!");
      navigate(`/listings/show/${listingId}`);
    } catch (error) {
      console.error("Error creating booking:", error);
      alert("Failed to create booking.");
    }
  });
}
