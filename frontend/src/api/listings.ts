import axios, { AxiosError } from "axios";
import { IListing } from "../interfaces/listing";
import { handleError } from "./handleError";
const token = localStorage.getItem("token");

export async function fetchListingsByCategory(
  category: string,
  page: number,
  limit: number
): Promise<{ listings: IListing[]; totalCount: number }> {
  try {
    const response = await fetch(
      `/api/listings?category=${encodeURIComponent(
        category
      )}&page=${page}&limit=${limit}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch listings: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching listings:", error);
    throw handleError(error);
  }
}

export async function fetchFilteredListings(
  minPrice: string,
  maxPrice: string,
  country: string,
  page: number,
  limit: number
): Promise<{ listings: IListing[]; totalCount: number }> {
  const params = new URLSearchParams({
    ...(minPrice && { minPrice }),
    ...(maxPrice && { maxPrice }),
    ...(country && { country }),
    page: page.toString(),
    limit: limit.toString(),
  });

  try {
    const response = await fetch(`/api/listings/filter?${params.toString()}`);
    if (!response.ok) {
      if (response.status === 404) {
        return { listings: [], totalCount: 0 };
      }
      throw new Error(
        `Failed to fetch filtered listings: ${response.statusText}`
      );
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching filtered listings:", error);
    throw handleError(error);
  }
}

export async function searchListings(
  query: string,
  page: number,
  limit: number
): Promise<{ listings: IListing[]; totalCount: number }> {
  try {
    const response = await fetch(
      `/api/listings/search?q=${encodeURIComponent(
        query
      )}&page=${page}&limit=${limit}`
    );
    if (!response.ok) {
      throw new Error(`Failed to search listings: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error searching listings:", error);
    throw handleError(error);
  }
}

export async function deleteListing(id: string): Promise<void> {
  try {
    await axios.delete(`/api/listings/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Error deleting listing:", error);
    throw handleError(error);
  }
}

export async function getListingsByUserId(userId: string): Promise<IListing[]> {
  try {
    const response = await axios.get(`/api/listings/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching listings by user ID:", error);
    throw handleError(error);
  }
}

export async function getListingById(id: string): Promise<IListing> {
  try {
    const response = await axios.get(`/api/listings/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching listing by ID:", error);
    throw handleError(error);
  }
}
