import { navigate } from "../main";
import { renderFilter } from "../components/renderFilter";
import { renderFilterModal } from "../components/renderFilterModal";
import {
  fetchFilteredListings,
  fetchListingsByCategory,
  searchListings,
} from "../utils/fetchListings";
import { IListing } from "../interfaces/listing";

let currentFilteredListings: IListing[] = [];
// Debouncing utility function
let debounceTimer: NodeJS.Timeout;
const debounce = (func: Function, delay: number) => {
  return (...args: any[]) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => func(...args), delay);
  };
};

export async function renderListings(
  container: HTMLElement,
  listings: IListing[]
) {
  renderFilter(container);
  renderFilterModal(container);

  container.innerHTML += `
    <div class="row row-cols-xxl-4 row-cols-lg-3 row-cols-md-2 row-cols-sm-1 mt-1">
      ${listings
        .map(
          (listing) => `
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

  // Add event listeners for each filter
  const filterButtons = container.querySelectorAll(".filter");
  filterButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const category = button.getAttribute("data-category") || "ALL";
      console.log(`Filter clicked: ${category}`);
      const filteredlistings = currentFilteredListings.length
        ? currentFilteredListings.filter(
            (listing) => listing.category === category || category === "ALL"
          )
        : await fetchListingsByCategory(category);
      console.log(filteredlistings);
      renderListings(container, filteredlistings);
    });
  });

  // Add event listeners for the tax switches
  const taxSwitches = document.querySelectorAll(".tax-switch");
  taxSwitches.forEach((taxSwitch) => {
    taxSwitch.addEventListener("change", () => {
      const isChecked = (taxSwitch as HTMLInputElement).checked;
      const listingCards = document.querySelectorAll(".listing-card");
      listingCards.forEach((card) => {
        const taxInfo = card.querySelector(".tax-info") as HTMLElement;
        taxInfo.style.display = isChecked ? "none" : "inline";
      });
    });
  });

  // Trigger the switch change event on page load to apply the initial state
  taxSwitches.forEach((taxSwitch) => {
    const event = new Event("change");
    taxSwitch.dispatchEvent(event);
  });

  // Apply Filters Button event listener
  const applyFiltersButton = document.getElementById("applyFilters");
  if (applyFiltersButton) {
    applyFiltersButton.addEventListener("click", async (event) => {
      event.preventDefault();
      const minPrice = (document.getElementById("minPrice") as HTMLInputElement)
        .value;
      const maxPrice = (document.getElementById("maxPrice") as HTMLInputElement)
        .value;
      const country = (document.getElementById("country") as HTMLInputElement)
        .value;

      currentFilteredListings = await fetchFilteredListings(
        minPrice,
        maxPrice,
        country
      );
      renderListings(container, currentFilteredListings);
    });
  }
  const performSearch = async () => {
    const query = (document.getElementById("mySearchInput") as HTMLInputElement)
      .value;
    if (query.length >= 1) {
      const searchResults = await searchListings(query);
      currentFilteredListings = searchResults; // Update global filtered listings
      renderListings(container, searchResults);
    } else {
      renderListings(container, currentFilteredListings); // Re-render with cached filtered listings
    }
  };

  // Handle input for search box with debounce
  const searchInput = document.getElementById(
    "mySearchInput"
  ) as HTMLInputElement;
  searchInput.addEventListener("input", debounce(performSearch, 300));

  // Handle form submission
  const searchForm = document.getElementById("searchBox") as HTMLFormElement;
  searchForm.addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent traditional form submission
    await performSearch(); // Call search function
  });
}
