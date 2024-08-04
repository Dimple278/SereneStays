import axios from "axios";
import { handleError } from "./handleError";
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
    handleError(error);
  }
};

export const bookingApi = {
  getBookingById: async (bookingId: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${bookingId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching booking:", error);
      handleError(error);
    }
  },

  getBookingsForListing: async (listingId: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/listing/${listingId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching bookings for listing:", error);
      handleError(error);
    }
  },

  getUserBookings: async (userId: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching user bookings:", error);
      handleError(error);
    }
  },

  createBooking: async (listingId: string, bookingData: any, token: string) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/listing/${listingId}`,
        bookingData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating booking:", error);
      handleError(error);
    }
  },

  updateBooking: async (bookingId: string, bookingData: any, token: string) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/${bookingId}`,
        bookingData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating booking:", error);
      handleError(error);
    }
  },

  deleteBooking: async (bookingId: string, token: string) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error deleting booking:", error);
      handleError(error);
    }
  },

  getUserBookingsForListing: async (token: string, listingId: string) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/user/listing/${listingId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching user bookings for listing:", error);
      handleError(error);
    }
  },
};
