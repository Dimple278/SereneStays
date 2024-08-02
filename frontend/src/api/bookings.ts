import axios from "axios";

export const fetchBookings = async (page: number = 1, limit: number = 10) => {
  try {
    const response = await axios.get(
      `/api/bookings?page=${page}&limit=${limit}`
    );
    console.log("Fetched bookings:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching bookings:", error);
    throw error;
  }
};
