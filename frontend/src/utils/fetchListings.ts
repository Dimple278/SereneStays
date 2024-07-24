import axios from "axios";
export interface IListing {
  id: string;
  title: string;
  images: string[];
  location: string;
  country: string;
  price: number;
}

export async function fetchListings() {
  try {
    const response = await axios.get("/api/listings");
    const listings: IListing[] = response.data;
    return listings;
  } catch (error) {
    console.error("Error fetching listings:", error);
    return [];
  }
}
