import { searchListings } from "../api/listings";
import { renderListings } from "../components/renderListings";
import { state, updateState } from "../state";
import { LISTINGS_PER_PAGE } from "../constants";
import { debounce } from "../utils/debouncer";

export function setupSearchHandler(container: HTMLElement) {
  const performSearch = async () => {
    const query = (document.getElementById("mySearchInput") as HTMLInputElement)
      .value;
    updateState({
      currentSearchQuery: query,
      currentCategory: "ALL",
      currentPage: 1,
    });

    if (query.length >= 1) {
      const { listings, totalCount } = await searchListings(
        query,
        state.currentPage,
        LISTINGS_PER_PAGE
      );
      updateState({ currentFilteredListings: listings });
      renderListings(container, listings, totalCount);
    } else {
      renderListings(
        container,
        state.currentFilteredListings,
        state.totalCount
      );
    }
  };

  const searchInput = document.getElementById(
    "mySearchInput"
  ) as HTMLInputElement;
  searchInput.addEventListener("input", debounce(performSearch, 300));

  const searchForm = document.getElementById("searchBox") as HTMLFormElement;
  searchForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    await performSearch();
  });
}
