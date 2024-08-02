import axios from "axios";
import { IListing } from "../interfaces/listing";
const token = localStorage.getItem("token");

export async function fetchListingsByCategory(
  category: string,
  page: number,
  limit: number
): Promise<{ listings: IListing[]; totalCount: number }> {
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
    throw new Error("Failed to fetch listings");
  }

  const data = await response.json();
  console.log("Fetched listings:", data.listings);
  return data;
}

export async function fetchFilteredListings(
  minPrice: string,
  maxPrice: string,
  country: string,
  page: number,
  limit: number
): Promise<{ listings: IListing[]; totalCount: number }> {
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
      throw new Error("Failed to fetch filtered listings");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching filtered listings:", error);
    return { listings: [], totalCount: 0 };
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
      throw new Error("Failed to search listings");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error searching listings:", error);
    throw error;
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
    alert("Failed to delete listing.");
  }
}
