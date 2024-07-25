import { navigate } from "../main";
interface Listing {
  id: string;
  title: string;
  images: string[];
  location: string;
  country: string;
  price: number;
}

export function renderListings(container: HTMLElement, listings: Listing[]) {
  container.innerHTML += `
    <div class="row row-cols-xxl-4 row-cols-lg-3 row-cols-md-2 row-cols-sm-1 mt-1">
      ${listings
        .map((listing) => {
          return `
            <div class="card col listing-card index-res" data-id="${
              listing.id
            }">
              <div class="index-res-img">
                <div class="card-img">
                  <img class="heart heart-r" src="/Icon/heart-red.png" alt="like" style="opacity: 1; z-index: 5;">
                  <img class="heart heart-b" src="/Icon/heart-black.png" alt="like" style="z-index: 6;">
                  <img src="${
                    listing.images
                  }" class="card-img-top" alt="listing_image" />
                </div>
                <div class="card-body mt-1 ms-2">
                  <p class="card-text" style="display: block;">
                    <b>${listing.title}</b> <br>
                    <span>&nbsp;${listing.location}, ${listing.country}</span>
                    <br>
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
          `;
        })
        .join("")}
    </div>
  `;

  // Add click event listeners to each listing card
  const listingCards = container.querySelectorAll(".listing-card");
  listingCards.forEach((card) => {
    card.addEventListener("click", (event) => {
      const id = (event.currentTarget as HTMLElement).dataset.id;
      if (id) {
        navigate(`/show/${id}`);
      }
    });
  });
}
