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
let currentCategory = "ALL";
let currentSearchQuery = "";
let currentMinPrice = "";
let currentMaxPrice = "";
let currentCountry = "";
let currentPage = 1;
const listingsPerPage = 10;

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
  listings: IListing[],
  totalCount: number
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
      currentCategory = category;
      currentSearchQuery = ""; // Reset search query when a new filter is applied
      currentPage = 1; // Reset to first page for new category
      const { listings, totalCount } = await fetchListingsByCategory(
        category,
        currentPage,
        listingsPerPage
      );
      currentFilteredListings = listings; // Update global filtered listings
      renderListings(container, listings, totalCount);
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
      currentMinPrice = (
        document.getElementById("minPrice") as HTMLInputElement
      ).value;
      currentMaxPrice = (
        document.getElementById("maxPrice") as HTMLInputElement
      ).value;
      currentCountry = (document.getElementById("country") as HTMLInputElement)
        .value;

      currentCategory = "ALL"; // Reset category when filters are applied
      currentSearchQuery = ""; // Reset search query when filters are applied
      currentPage = 1; // Reset to first page for new filters
      const { listings, totalCount } = await fetchFilteredListings(
        currentMinPrice,
        currentMaxPrice,
        currentCountry,
        currentPage,
        listingsPerPage
      );
      currentFilteredListings = listings; // Update global filtered listings
      renderListings(container, listings, totalCount);
    });
  }

  const performSearch = async () => {
    const query = (document.getElementById("mySearchInput") as HTMLInputElement)
      .value;
    currentSearchQuery = query; // Update global search query
    if (query.length >= 1) {
      currentCategory = "ALL"; // Reset category when search is performed
      currentPage = 1; // Reset to first page for new search
      const { listings, totalCount } = await searchListings(
        query,
        currentPage,
        listingsPerPage
      );
      currentFilteredListings = listings; // Update global filtered listings
      renderListings(container, listings, totalCount);
    } else {
      renderListings(container, currentFilteredListings, totalCount); // Re-render with cached filtered listings
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

  // Pagination
  const totalPages = Math.ceil(totalCount / listingsPerPage);
  const paginationContainer = document.createElement("div");
  paginationContainer.className =
    "pagination-container d-flex justify-content-center mt-3";

  for (let page = 1; page <= totalPages; page++) {
    const pageButton = document.createElement("button");
    pageButton.textContent = page.toString();
    pageButton.className = "pagination-button btn btn-outline-danger mx-1";
    pageButton.addEventListener("click", async () => {
      currentPage = page;
      let listingsData;
      if (currentSearchQuery) {
        // Fetch search results if a search query is active
        listingsData = await searchListings(
          currentSearchQuery,
          currentPage,
          listingsPerPage
        );
      } else if (currentMinPrice || currentMaxPrice || currentCountry) {
        // Fetch filtered listings if filters are active
        listingsData = await fetchFilteredListings(
          currentMinPrice,
          currentMaxPrice,
          currentCountry,
          currentPage,
          listingsPerPage
        );
      } else {
        // Fetch category listings if a category filter is active
        listingsData = await fetchListingsByCategory(
          currentCategory,
          currentPage,
          listingsPerPage
        );
      }
      renderListings(container, listingsData.listings, listingsData.totalCount);
    });
    paginationContainer.appendChild(pageButton);
  }

  container.appendChild(paginationContainer);
}
