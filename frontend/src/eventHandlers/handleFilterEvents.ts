import {
  fetchFilteredListings,
  fetchListingsByCategory,
} from "../utils/fetchListings";
import { renderListings } from "../components/renderListings";

let currentCategory = "ALL";
let currentMinPrice = "";
let currentMaxPrice = "";
let currentCountry = "";
let currentPage = 1;
const listingsPerPage = 10;

export const handleFilterEvents = (container: HTMLElement) => {
  const filterButtons = container.querySelectorAll(".filter");
  filterButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const category = button.getAttribute("data-category") || "ALL";
      currentCategory = category;
      currentPage = 1; // Reset to first page for new category
      const { listings, totalCount } = await fetchListingsByCategory(
        category,
        currentPage,
        listingsPerPage
      );
      renderListings(container, listings, totalCount);
    });
  });

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
      currentPage = 1; // Reset to first page for new filters
      const { listings, totalCount } = await fetchFilteredListings(
        currentMinPrice,
        currentMaxPrice,
        currentCountry,
        currentPage,
        listingsPerPage
      );
      renderListings(container, listings, totalCount);
    });
  }
};
