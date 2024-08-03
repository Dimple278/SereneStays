import axios from "axios";
const API_BASE_URL = "/api/bookings";
const token = localStorage.getItem("token");

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

export const bookingApi = {
  getBookingById: async (bookingId: string) => {
    const response = await axios.get(`${API_BASE_URL}/${bookingId}`);
    return response.data;
  },

  getBookingsForListing: async (listingId: string) => {
    const response = await axios.get(`${API_BASE_URL}/listing/${listingId}`);
    return response.data;
  },

  getUserBookings: async (userId: string) => {
    const response = await axios.get(`${API_BASE_URL}/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  createBooking: async (listingId: string, bookingData: any, token: string) => {
    const response = await axios.post(
      `${API_BASE_URL}/listing/${listingId}`,
      bookingData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  updateBooking: async (bookingId: string, bookingData: any, token: string) => {
    const response = await axios.put(
      `${API_BASE_URL}/${bookingId}`,
      bookingData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  deleteBooking: async (bookingId: string, token: string) => {
    const response = await axios.delete(`${API_BASE_URL}/${bookingId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  getUserBookingsForListing: async (token: string, listingId: string) => {
    const response = await axios.get(
      `${API_BASE_URL}/user/listing/${listingId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },
};
