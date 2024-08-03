import axios from "axios";
import { navigate } from "../main";

/**
 * Fetches the current user's information from the API and stores it.
 * @returns {Promise<any>} - A promise that resolves to the current user's data.
 */
export const getCurrUser = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    return null; // Return null instead of throwing an error
  }

  try {
    const currUserResponse = await axios.get(`/api/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return currUserResponse.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};

export const currUser = await getCurrUser();
