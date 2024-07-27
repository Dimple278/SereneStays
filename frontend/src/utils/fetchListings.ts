import { IListing } from "../interfaces/listing";

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
  country: string
): Promise<IListing[]> {
  const params = new URLSearchParams();
  if (minPrice) params.append("minPrice", minPrice);
  if (maxPrice) params.append("maxPrice", maxPrice);
  if (country) params.append("country", country);

  const response = await fetch(`/api/listings/filter?${params.toString()}`);
  return response.json();
}

export async function searchListings(query: string): Promise<IListing[]> {
  try {
    const response = await fetch(
      `/api/listings/search?q=${encodeURIComponent(query)}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching search results:", error);
    return [];
  }
}
