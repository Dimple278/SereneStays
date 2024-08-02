import { IState } from "../interfaces/state";

export class GlobalState {
  private state: IState;
  private static instance: GlobalState;

  private constructor() {
    this.state = {
      currentFilteredListings: [],
      currentCategory: "ALL",
      currentSearchQuery: "",
      currentMinPrice: "",
      currentMaxPrice: "",
      currentCountry: "",
      currentPage: 1,
      listingsPerPage: 10,
    };
  }

  public static getInstance(): GlobalState {
    if (!GlobalState.instance) {
      GlobalState.instance = new GlobalState();
    }
    return GlobalState.instance;
  }

  public getState(): IState {
    return this.state;
  }

  public setState(newState: Partial<IState>): void {
    this.state = { ...this.state, ...newState };
  }
}

export const GLOBAL_STATE = {
  debounceTimer: 300,
};
