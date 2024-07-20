import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

interface Listing {
  id: string;
  title: string;
  image: { url: string };
  location: string;
  country: string;
  price: number;
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
    <div class="row row-cols-xxl-4 row-cols-lg-3 row-cols-md-2 row-cols-sm-1 mt-1">
      ${listings
        .map(
          (listing) => `
        <a href="/show/${
          listing.id
        }" class="listing-link col mb-4" data-link="show/${listing.id}">
          <div class="card listing-card h-100">
            <div class="card-img">
              <img src="${
                listing.image
              }" class="card-img-top" alt="listing_image" />
              <img class="heart heart-r" src="/Icon/heart-red.png" alt="like" style="opacity: 1; z-index: 5;">
              <img class="heart heart-b" src="/Icon/heart-black.png" alt="like" style="z-index: 6;">
            </div>
            <div class="card-body mt-1 ms-2">
              <p class="card-text">
                <b>${listing.title}</b> <br>
                <span>${listing.location}, ${listing.country}</span> <br>
                <span>
                  ${Math.floor(Math.random() * 4 + 2)} nights • 
                  ${
                    new Date().getDate() + Math.floor(Math.random() * 28 + 1)
                  }-${
            new Date().getDate() +
            Math.floor(Math.random() * 28 + 1) +
            Math.floor(Math.random() * 4 + 2)
          }
                  ${new Date().toLocaleString("default", { month: "short" })}
                </span> <br>
                <span class="price-info">
                  <span class="fw-bold">&#8377;${listing.price.toLocaleString(
                    "en-IN"
                  )} </span> night
                </span>
                <i class="tax-info tax-underline ms-1">
                  <b>&#8377;${(listing.price * 1.18).toLocaleString(
                    "en-In"
                  )}</b> total after taxes
                </i>
              </p>
            </div>
          </div>
        </a>
      `
        )
        .join("")}
    </div>
  `;
}
