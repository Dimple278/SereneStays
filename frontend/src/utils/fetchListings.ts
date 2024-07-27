import { IListing } from "../interfaces/listing";

export async function fetchListingsByCategory(
  category: string
): Promise<IListing[]> {
  const response = await fetch(
    `/api/listings?category=${encodeURIComponent(category)}`,
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
  console.log(data);
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
