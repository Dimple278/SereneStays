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
    <div class="row row-cols-xxl-4 row-cols-lg-3 row-cols-md-2 row-cols-sm-1 mt-1">
      ${listings
        .map((listing) => {
          const day = Math.floor(Math.random() * 4 + 2);
          const no = Math.floor(Math.random() * 28 + 1);
          const date = new Date().getDate() + no;
          const dateA = new Date().getDate() + no + day;
          const month = new Date().toLocaleString("default", {
            month: "short",
          });
          return `
            <a href="/show/${listing.id}" class="listing-link">
              <div class="card col listing-card index-res">
                <div class="index-res-img">
                  <div class="card-img">
                    <img class="heart heart-r" src="/Icon/heart-red.png" alt="like" style="opacity: 1; z-index: 5;">
                    <img class="heart heart-b" src="/Icon/heart-black.png" alt="like" style="z-index: 6;">
                    <img src="${
                      listing.image
                    }" class="card-img-top" alt="listing_image" />
                  </div>
                  <div class="card-body mt-1 ms-2">
                    <p class="card-text" style="display: block;">
                      <b>${listing.title}</b> <br>
                      <span>&nbsp;${listing.location}, ${listing.country}</span>
                      <span style="display: block;">
                        <span class="tax-info">&nbsp;${day} nights •</span> &nbsp;${date}-${dateA} &nbsp;&nbsp;${month}
                      </span>
                      <span class="price-info">
                        <span class="fw-bold">&nbsp;&#8377;${listing.price.toLocaleString(
                          "en-IN"
                        )} </span> night
                      </span>
                      <i class="tax-info tax-underline ms-1">
                        <b>&#8377;${(listing.price * 1.18).toLocaleString(
                          "en-IN"
                        )}</b> &nbsp;total after taxes
                      </i>
                    </p>
                  </div>
                </div>
              </div>
            </a>
          `;
        })
        .join("")}
    </div>
  `;
}
