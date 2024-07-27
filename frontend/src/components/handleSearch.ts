import { searchListings } from "../utils/fetchListings";
import { renderListings } from "./renderListings";
import { IListing } from "../interfaces/listing";

// Debouncing utility function
let debounceTimer: NodeJS.Timeout;
const debounce = (func: Function, delay: number) => {
  return (...args: any[]) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => func(...args), delay);
  };
};

let currentFilteredListings: IListing[] = [];

export function handleSearch(container: HTMLElement) {
  const performSearch = async () => {
    const query = (document.getElementById("mySearchInput") as HTMLInputElement)
      .value;
    if (query.length >= 1) {
      const searchResults = await searchListings(query);
      currentFilteredListings = searchResults; // Update global filtered listings
      renderListings(container, searchResults);
    } else {
      renderListings(
        container,
        currentFilteredListings
        // currentFilteredListings.length
      ); // Re-render with cached filtered listings
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
