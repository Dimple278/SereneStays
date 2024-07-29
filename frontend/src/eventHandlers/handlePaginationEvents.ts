import {
  fetchFilteredListings,
  fetchListingsByCategory,
  searchListings,
} from "../api/fetchListings";
import { renderListings } from "../components/renderListings";
import { IListing } from "../interfaces/listing";

let currentFilteredListings: IListing[] = [];
let currentCategory = "ALL";
let currentSearchQuery = "";
let currentMinPrice = "";
let currentMaxPrice = "";
let currentCountry = "";
let currentPage = 1;
const listingsPerPage = 10;

export const handlePaginationEvents = (
  container: HTMLElement,
  totalCount: number,
  listingsPerPage: number,
  currentContext: string
) => {
  const setupPagination = (totalCount: number) => {
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
        switch (currentContext) {
          case "SEARCH":
            listingsData = await searchListings(
              currentSearchQuery,
              currentPage,
              listingsPerPage
            );
            break;
          case "FILTER":
            listingsData = await fetchFilteredListings(
              currentMinPrice,
              currentMaxPrice,
              currentCountry,
              currentPage,
              listingsPerPage
            );
            break;
          case "CATEGORY":
          default:
            listingsData = await fetchListingsByCategory(
              currentCategory,
              currentPage,
              listingsPerPage
            );
            break;
        }
        renderListings(
          container,
          listingsData.listings,
          listingsData.totalCount,
          currentContext
        );
      });
      paginationContainer.appendChild(pageButton);
    }

    container.appendChild(paginationContainer);
  };

  // Clear previous pagination buttons if any
  const existingPaginationContainer = container.querySelector(
    ".pagination-container"
  );
  if (existingPaginationContainer) {
    existingPaginationContainer.remove();
  }

  setupPagination(totalCount);
};
