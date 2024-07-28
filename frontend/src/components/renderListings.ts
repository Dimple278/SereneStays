import { handlePaginationEvents } from "../eventHandlers/handlePaginationEvents";
import { IListing } from "../interfaces/listing";
import { handleFilterEvents } from "../eventHandlers/handleFilterEvents";
import { handleSearchEvents } from "../eventHandlers/handleSearchEvents";
import { handleTaxSwitchEvents } from "../eventHandlers/handleTaxSwitchEvents";
import { navigate } from "../main";
import { renderFilter } from "./renderFilter";
import { renderFilterModal } from "./renderFilterModal";

let currentCategory = "ALL";
let currentPage = 1;
const listingsPerPage = 10;

export async function renderListings(
  container: HTMLElement,
  listings: IListing[],
  totalCount: number,
  currentContext: string = "ALL"
) {
  console.log("Fetched listings", listings);

  // Clear container before rendering
  container.innerHTML = "";

  renderFilter(container);
  renderFilterModal(container);

  // Append listings
  container.innerHTML += `
  <div class="row row-cols-xxl-4 row-cols-lg-3 row-cols-md-2 row-cols-sm-1 mt-1">
    ${listings
      .map(
        (listing) => `
          <div class="card col listing-card index-res" data-id="${listing.id}">
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
                  <i class="tax-info tax-underline ms-1"><i class="rs-sign"><b> &#8377;</i>${(
                    listing.price * 1.18
                  ).toLocaleString("en-IN")}</b> &nbsp;total after taxes</i>
                </p>
              </div>
            </div>
          </div>
        `
      )
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

  // Event handlers
  handleFilterEvents(container);
  handleTaxSwitchEvents(container);
  handleSearchEvents(container);
  handlePaginationEvents(
    container,
    totalCount,
    listingsPerPage,
    currentContext
  );
}
