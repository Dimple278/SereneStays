import { renderShowPage } from "./show";

interface Listing {
  id: string;
  title: string;
}

export async function fetchListings() {
  try {
    const response = await fetch("/api/listings");
    const listings: Listing[] = await response.json();
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

  container.querySelectorAll("a[data-link]").forEach((link) => {
    link.addEventListener("click", async (event) => {
      event.preventDefault();
      const target = event.target as HTMLAnchorElement;
      const page = target.dataset.link;
      if (page) {
        window.history.pushState({}, "", page);
        const id = page.split("/")[1];
        renderShowPage(container, id);
      }
    });
  });
}
