import { state } from "../state";
import {
  searchListings,
  fetchFilteredListings,
  fetchListingsByCategory,
} from "../api/listings";
import { renderListings } from "../components/renderListings";
import { LISTINGS_PER_PAGE } from "../constants";

export async function fetchAndRenderListings(container: HTMLElement) {
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
}
