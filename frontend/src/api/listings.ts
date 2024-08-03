import axios from "axios";
import { IListing } from "../interfaces/listing";

const token = localStorage.getItem("token");

export async function fetchListingsByCategory(
  category: string,
  page: number,
  limit: number
): Promise<{ listings: IListing[]; totalCount: number; error?: string }> {
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
      return { listings: [], totalCount: 0, error: "Failed to fetch listings" };
    }

    const data = await response.json();
    console.log("Fetched listings:", data.listings);
    return data;
  } catch (error) {
    console.error("Error fetching listings:", error);
    return {
      listings: [],
      totalCount: 0,
      error: "An unexpected error occurred",
    };
  }
}

export async function fetchFilteredListings(
  minPrice: string,
  maxPrice: string,
  country: string,
  page: number,
  limit: number
): Promise<{ listings: IListing[]; totalCount: number; error?: string }> {
  const params = new URLSearchParams();
  if (minPrice) params.append("minPrice", minPrice);
  if (maxPrice) params.append("maxPrice", maxPrice);
  if (country) params.append("country", country);
  params.append("page", page.toString());
  params.append("limit", limit.toString());

  try {
    const response = await fetch(`/api/listings/filter?${params.toString()}`);
    if (!response.ok) {
      if (response.status === 404) {
        return { listings: [], totalCount: 0 };
      }
      return {
        listings: [],
        totalCount: 0,
        error: "Failed to fetch filtered listings",
      };
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching filtered listings:", error);
    return {
      listings: [],
      totalCount: 0,
      error: "An unexpected error occurred",
    };
  }
}

export async function searchListings(
  query: string,
  page: number,
  limit: number
): Promise<{ listings: IListing[]; totalCount: number; error?: string }> {
  try {
    const response = await fetch(
      `/api/listings/search?q=${encodeURIComponent(
        query
      )}&page=${page}&limit=${limit}`
    );
    if (!response.ok) {
      return {
        listings: [],
        totalCount: 0,
        error: "Failed to search listings",
      };
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error searching listings:", error);
    return {
      listings: [],
      totalCount: 0,
      error: "An unexpected error occurred",
    };
  }
}

export async function deleteListing(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await axios.delete(`/api/listings/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { success: true };
  } catch (error) {
    console.error("Error deleting listing:", error);
    return { success: false, error: "Failed to delete listing" };
  }
}

export async function getListingsByUserId(userId: string) {
  const response = await axios.get(`/api/listings/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function getListingById(id: string) {
  const response = await axios.get(`/api/listings/${id}`);
  return response.data;
}
