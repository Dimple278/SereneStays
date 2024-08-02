import { IListing } from "../interfaces/listing";
import { createNoListingsMessage } from "../utils/noListingMsg";
import { state } from "../state";
import { setupEventListeners } from "../utils/eventListeners";
import { renderFilter } from "../components/renderFilter";
import { renderFilterModal } from "../components/renderFilterModal";
import { createNoResultsMessage } from "../utils/createNoResultsMessage";

export function renderListings(
  container: HTMLElement,
  listings: IListing[],
  totalCount: number
) {
  // Clear the container
  container.innerHTML = "";

  // Render filter and filter modal
  renderFilter(container);
  renderFilterModal(container);

  if (listings.length === 0) {
    let message = createNoListingsMessage(state.currentCategory);

    // Check if filters or search are applied
    if (
      state.currentSearchQuery ||
      state.currentMinPrice ||
      state.currentMaxPrice ||
      state.currentCountry
    ) {
      message = createNoResultsMessage();
    }

    container.innerHTML += message;
  } else {
    const listingsHTML = `
      <div class="row row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-lg-3 row-cols-xxl-4 g-4 mt-1">
        ${listings
          .map(
            (listing) => `
          <div class="col">
            <div class="card listing-card index-res" data-id="${listing.id}">
              <div class="index-res-img position-relative">
                <div class="card-img">
                  <img class="heart heart-r" src="/Icon/heart-red.png" alt="like" style="opacity: 1; z-index: 5;">
                  <img class="heart heart-b" src="/Icon/heart-black.png" alt="like" style="z-index: 6;">
                  <img src="${
                    listing.images[0]
                  }" class="card-img-top" alt="listing_image" />
                </div>
                <div class="card-body mt-1">
                  <p class="card-text">
                    <b>${listing.title}</b> <br>
                    <span>${listing.location}, ${listing.country}</span>
                    <br>
                    <span class="price-info">
                      <span class="fw-bold">&#8377;${listing.price.toLocaleString(
                        "en-IN"
                      )} </span> night 
                    </span>
                    <i class="tax-info tax-underline ms-1"><i class="rs-sign"><b>&#8377;</i>${(
                      listing.price * 1.18
                    ).toLocaleString("en-IN")}</b> total after taxes</i>
                  </p>
                </div>
              </div>
            </div>
          </div>
        `
          )
          .join("")}
      </div>
    `;

    container.innerHTML += listingsHTML;
  }

  // Setup event listeners
  setupEventListeners(container, totalCount);

  // Preserve active filter state
  const activeFilter = container.querySelector(
    `.filter[data-category="${state.currentCategory}"]`
  );
  if (activeFilter) {
    activeFilter.classList.add("active");
  }

  // Update the search input with the current search query
  const searchInput = document.getElementById(
    "mySearchInput"
  ) as HTMLInputElement;
  if (searchInput) {
    searchInput.value = state.currentSearchQuery;
  }

  // Update filter inputs with current values
  const minPriceInput = document.getElementById("minPrice") as HTMLInputElement;
  const maxPriceInput = document.getElementById("maxPrice") as HTMLInputElement;
  const countryInput = document.getElementById("country") as HTMLInputElement;

  if (minPriceInput) minPriceInput.value = state.currentMinPrice;
  if (maxPriceInput) maxPriceInput.value = state.currentMaxPrice;
  if (countryInput) countryInput.value = state.currentCountry;
}
