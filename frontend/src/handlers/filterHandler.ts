import {
  fetchFilteredListings,
  fetchListingsByCategory,
} from "../api/listings";
import { renderListings } from "../components/renderListings";
import { state, updateState } from "../state";
import { LISTINGS_PER_PAGE } from "../constants";

export function setupFilterHandlers(container: HTMLElement) {
  const filterButtons = container.querySelectorAll(".filter");
  filterButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const category = button.getAttribute("data-category") || "ALL";
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      updateState({
        currentCategory: category,
        currentSearchQuery: "",
        currentMinPrice: "",
        currentMaxPrice: "",
        currentCountry: "",
        currentPage: 1,
      });
      const { listings, totalCount } = await fetchListingsByCategory(
        category,
        state.currentPage,
        LISTINGS_PER_PAGE
      );
      updateState({ currentFilteredListings: listings });

      renderListings(container, listings, totalCount);
    });
  });

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

      updateState({
        currentMinPrice: minPrice,
        currentMaxPrice: maxPrice,
        currentCountry: country,
        currentCategory: "ALL",
        currentSearchQuery: "",
        currentPage: 1,
      });

      const { listings, totalCount } = await fetchFilteredListings(
        minPrice,
        maxPrice,
        country,
        state.currentPage,
        LISTINGS_PER_PAGE
      );
      console.log("FilterListings:", listings);
      updateState({ currentFilteredListings: listings });
      renderListings(container, listings, totalCount);
    });
  }
}
