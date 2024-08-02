import { state } from "../state";

export function createNoResultsMessage(): string {
  let message = "No listings found ";

  if (state.currentSearchQuery) {
    message += `for "${state.currentSearchQuery}" `;
  }

  if (state.currentMinPrice || state.currentMaxPrice) {
    message += "in the specified price range ";
  }

  if (state.currentCountry) {
    message += `in ${state.currentCountry} `;
  }

  message += "Please try adjusting your filters or search criteria.";

  return `
      <div class="alert alert-info mt-3" role="alert">
        ${message}
      </div>
    `;
}
