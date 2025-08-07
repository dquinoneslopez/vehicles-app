import { MemoizedSelector } from "@ngrx/store";
import { MockStore } from "@ngrx/store/testing";
import { AppState } from "../../app/store/state/app.state";

export function setupMockSelectors(store: MockStore) {
  // Define all your selectors here
  store.overrideSelector("selectAllMakes", []);
  store.overrideSelector("selectLoading", false);
  store.overrideSelector("selectSearchTerm", "");
  store.overrideSelector("selectError", null);
}
