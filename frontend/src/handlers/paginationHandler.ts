import { LISTINGS_PER_PAGE } from "../constants";

export function setupPagination(
  container: HTMLElement,
  totalCount: number,
  currentPage: number,
  onPageChange: (page: number) => void
) {
  const totalPages = Math.ceil(totalCount / LISTINGS_PER_PAGE);
  const paginationContainer = document.createElement("div");
  paginationContainer.className =
    "pagination-container d-flex justify-content-center mt-3";

  for (let page = 1; page <= totalPages; page++) {
    const pageButton = document.createElement("button");
    pageButton.textContent = page.toString();
    pageButton.className = `pagination-button btn btn-outline-danger mx-1 ${
      page === currentPage ? "active" : ""
    }`;
    pageButton.addEventListener("click", () => {
      onPageChange(page);
    });
    paginationContainer.appendChild(pageButton);
  }

  container.appendChild(paginationContainer);
}
