import {
  searchListings,
  fetchFilteredListings,
  fetchListingsByCategory,
} from "../api/fetchListings";
import { renderListings } from "../components/renderListings";
import { state, updateState } from "../state";
import { LISTINGS_PER_PAGE } from "../constants";

export function setupPagination(container: HTMLElement, totalCount: number) {
  const totalPages = Math.ceil(totalCount / LISTINGS_PER_PAGE);
  const paginationContainer = document.createElement("div");
  paginationContainer.className =
    "pagination-container d-flex justify-content-center mt-3";

  for (let page = 1; page <= totalPages; page++) {
    const pageButton = document.createElement("button");
    pageButton.textContent = page.toString();
    pageButton.className = `pagination-button btn btn-outline-danger mx-1 ${
      page === state.currentPage ? "active" : ""
    }`;

    pageButton.addEventListener("click", async () => {
      updateState({ currentPage: page });
      let listingsData;
      if (state.currentSearchQuery) {
        listingsData = await searchListings(
          state.currentSearchQuery,
          state.currentPage,
          LISTINGS_PER_PAGE
        );
      } else if (
        state.currentMinPrice ||
        state.currentMaxPrice ||
        state.currentCountry
      ) {
        listingsData = await fetchFilteredListings(
          state.currentMinPrice,
          state.currentMaxPrice,
          state.currentCountry,
          state.currentPage,
          LISTINGS_PER_PAGE
        );
      } else {
        listingsData = await fetchListingsByCategory(
          state.currentCategory,
          state.currentPage,
          LISTINGS_PER_PAGE
        );
      }
      renderListings(container, listingsData.listings, listingsData.totalCount);
    });
    paginationContainer.appendChild(pageButton);
  }

  container.appendChild(paginationContainer);
}
