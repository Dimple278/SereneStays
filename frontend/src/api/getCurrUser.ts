import axios, { AxiosError } from "axios";
import { navigate } from "../main";
import { IUser } from "../interfaces/users";

interface ErrorResponse {
  message: string;
}

/**
 * Fetches the current user's information from the API and stores it.
 * @returns {Promise<User | null>} - A promise that resolves to the current user's data or null.
 */
export const getCurrUser = async (): Promise<IUser | null> => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.warn("No token found in localStorage");
    return null;
  }

  try {
    const response = await axios.get<IUser>(`/api/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ErrorResponse>;
      if (axiosError.response) {
        if (axiosError.response.status === 401) {
          console.warn(
            "Unauthorized access, token might be invalid or expired"
          );
          localStorage.removeItem("token"); // Clear the invalid token
          navigate("/login"); // Redirect to login page
        } else {
          console.error(
            "Error fetching user data:",
            axiosError.response.data.message
          );
        }
      } else if (axiosError.request) {
        console.error("No response received:", axiosError.request);
      } else {
        console.error("Error setting up request:", axiosError.message);
      }
    } else {
      console.error("Unexpected error:", error);
    }
    return null;
  }
};

// Use an IIFE to handle the asynchronous nature of getCurrUser
export const currUser = await (async () => {
  try {
    return await getCurrUser();
  } catch (error) {
    console.error("Error initializing currUser:", error);
    return null;
  }
})();
