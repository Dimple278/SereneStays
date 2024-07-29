import { searchListings } from "../api/fetchListings";
import { debounce } from "../utils/debouncer";
import { renderListings } from "../components/renderListings";

let currentSearchQuery = "";

export const handleSearchEvents = (container: HTMLElement) => {
  const debounce = (func: Function, delay: number) => {
    let debounceTimer: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => func(...args), delay);
    };
  };

  const performSearch = async () => {
    currentSearchQuery = (
      document.getElementById("mySearchInput") as HTMLInputElement
    ).value;
    if (currentSearchQuery.length >= 1) {
      const searchResults = await searchListings(
        currentSearchQuery,
        1, // Reset to first page for new search
        10 // listingsPerPage
      );
      renderListings(
        container,
        searchResults.listings,
        searchResults.totalCount,
        "SEARCH"
      );
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
};
