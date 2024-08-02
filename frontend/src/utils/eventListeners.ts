import { navigate } from "../main";
import { setupFilterHandlers } from "./filterHandler";
import { setupSearchHandler } from "./searchHandler";
import { setupPagination } from "./paginationHandler";

export function setupEventListeners(
  container: HTMLElement,
  totalCount: number
) {
  const listingCards = container.querySelectorAll(".listing-card");
  listingCards.forEach((card) => {
    card.addEventListener("click", (event) => {
      const id = (event.currentTarget as HTMLElement).dataset.id;
      if (id) {
        navigate(`/show/${id}`);
      }
    });
  });

  setupFilterHandlers(container);
  setupSearchHandler(container);
  setupPagination(container, totalCount);

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

  taxSwitches.forEach((taxSwitch) => {
    const event = new Event("change");
    taxSwitch.dispatchEvent(event);
  });
}
