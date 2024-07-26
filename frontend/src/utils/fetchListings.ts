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
