import axios from "axios";

/**
 * Fetches the current user's information from the API and stores it.
 * @returns {Promise<any>} - A promise that resolves to the current user's data.
 */
export const getCurrUser = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found in local storage");
  }

  const currUserResponse = await axios.get(`/api/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return currUserResponse.data;
};

export const currUser = await getCurrUser();
