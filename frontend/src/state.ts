import { State } from "./interfaces/state";

export let state: State = {
  currentFilteredListings: [],
  currentCategory: "ALL",
  currentSearchQuery: "",
  currentMinPrice: "",
  currentMaxPrice: "",
  currentCountry: "",
  currentPage: 1,
  totalCount: 0,
};

export function updateState(newState: Partial<State>) {
  state = { ...state, ...newState };
}
