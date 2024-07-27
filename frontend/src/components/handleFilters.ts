import {
  fetchListingsByCategory,
  fetchFilteredListings,
} from "../utils/fetchListings";
import { renderListings } from "./renderListings";
import { IListing } from "../interfaces/listing";

let currentFilteredListings: IListing[] = [];
let currentCategory = "ALL";
let currentPage = 1;
const listingsPerPage = 10;

export async function handleFilters(container: HTMLElement) {
  // Add event listeners for each filter
  const filterButtons = container.querySelectorAll(".filter");
  filterButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const category = button.getAttribute("data-category") || "ALL";
      console.log(`Filter clicked: ${category}`);
      currentCategory = category;
      currentPage = 1; // Reset to first page for new category
      const { listings, totalCount } = await fetchListingsByCategory(
        category,
        currentPage,
        listingsPerPage
      );
      renderListings(container, listings);
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
}
