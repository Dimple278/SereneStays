import { renderFilter } from "../components/renderFilter";
import { renderFilterModal } from "../components/renderFilterModal";
import { fetchListingsByCategory } from "../api/listings";
import { renderListings } from "../components/renderListings";
import { updateState } from "../state";
import { LISTINGS_PER_PAGE } from "../constants";

export async function initializeListings(container: HTMLElement) {
  renderFilter(container);
  renderFilterModal(container);

  const { listings, totalCount } = await fetchListingsByCategory(
    "ALL",
    1,
    LISTINGS_PER_PAGE
  );
  updateState({ currentFilteredListings: listings, totalCount });
  renderListings(container, listings, totalCount);
}
