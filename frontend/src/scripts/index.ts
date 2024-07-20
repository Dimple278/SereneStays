import axios from "axios";

interface Listing {
  id: string;
  title: string;
}

export async function fetchListings() {
  try {
    const response = await axios.get("/api/listings");
    const listings: Listing[] = response.data;
    return listings;
  } catch (error) {
    console.error("Error fetching listings:", error);
    return [];
  }
}

export function renderListings(container: HTMLElement, listings: Listing[]) {
  container.innerHTML = `
    <h2>All Listings</h2>
    <ul>
      ${listings
        .map(
          (listing) => `
        <li><a href="/show/${listing.id}" data-link="show/${listing.id}">${listing.title}</a></li>
      `
        )
        .join("")}
    </ul>
  `;
}
