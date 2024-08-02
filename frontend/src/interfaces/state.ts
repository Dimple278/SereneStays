import { IListing } from "./listing";

export interface State {
  currentFilteredListings: IListing[];
  currentCategory: string;
  currentSearchQuery: string;
  currentMinPrice: string;
  currentMaxPrice: string;
  currentCountry: string;
  currentPage: number;
  totalCount: number;
}
