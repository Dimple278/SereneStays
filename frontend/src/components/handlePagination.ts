import { fetchListingsByCategory } from "../api/fetchListings";
import { renderListings } from "./renderListings";

let currentPage = 1;
let currentCategory = "ALL";
const listingsPerPage = 10;

export async function handlePagination(
  container: HTMLElement,
  totalCount: number
) {
  const totalPages = Math.ceil(totalCount / listingsPerPage);
  const paginationContainer = document.createElement("div");
  paginationContainer.className =
    "pagination-container pagination d-flex justify-content-center mt-3";

  for (let page = 1; page <= totalPages; page++) {
    const pageButton = document.createElement("button");
    pageButton.textContent = page.toString();
    pageButton.className = "pagination-button btn btn-outline-danger mx-1";
    pageButton.addEventListener("click", async () => {
      currentPage = page;
      const { listings } = await fetchListingsByCategory(
        currentCategory,
        currentPage,
        listingsPerPage
      );
      renderListings(container, listings);
      handlePagination(container, totalCount); // Re-render pagination buttons
    });
    paginationContainer.appendChild(pageButton);
  }

  // Clear existing pagination before adding new buttons
  const existingPagination = container.querySelector(".pagination-container");
  if (existingPagination) {
    existingPagination.remove();
  }

  container.appendChild(paginationContainer);
}
