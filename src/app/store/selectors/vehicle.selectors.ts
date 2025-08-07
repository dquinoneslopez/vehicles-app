import { createFeatureSelector, createSelector } from "@ngrx/store";
import { VehicleState } from "../state/vehicle.state";
import { VehicleType } from "../../models/vehicle-type.model";

export const selectVehicleState =
  createFeatureSelector<VehicleState>("vehicles");

// Existing selectors
export const selectAllVehicles = createSelector(
  selectVehicleState,
  (state: VehicleState) => state.vehicles
);

export const selectVehicleTypes = createSelector(
  selectVehicleState,
  (state: VehicleState) => state.vehicleTypes
);

export const selectLoading = createSelector(
  selectVehicleState,
  (state: VehicleState) => state.loading
);

export const selectError = createSelector(
  selectVehicleState,
  (state: VehicleState) => state.error
);

export const selectSearchTerm = createSelector(
  selectVehicleState,
  (state: VehicleState) => state.searchTerm
);

// Vehicle models selectors
export const selectVehicleModels = createSelector(
  selectVehicleState,
  (state: VehicleState) => state.vehicleModels
);

export const selectCurrentMakeId = createSelector(
  selectVehicleState,
  (state: VehicleState) => state.currentMakeId
);

// Get vehicle types for current make (from context, not by filtering)
export const selectCurrentMakeVehicleTypes = createSelector(
  selectVehicleState,
  (state: VehicleState) => {
    // Return vehicle types loaded for current make
    return state.vehicleTypes;
  }
);

// Get vehicle types for a specific make
export const selectVehicleTypesForMake = (makeId: number) =>
  createSelector(selectVehicleState, (state: VehicleState) => {
    return state.vehicleTypesForMake[makeId] || [];
  });

export const selectCurrentMakeVehicleModels = createSelector(
  selectVehicleState,
  (state: VehicleState) => {
    if (!state.currentMakeId) return [];
    // Vehicle models DO have Make_ID, so we can filter by it
    return state.vehicleModels.filter(
      (vm) => vm.Make_ID === state.currentMakeId
    );
  }
);

// Cache status selectors
export const selectIsVehicleTypesLoadedForMake = (makeId: number) =>
  createSelector(selectVehicleState, (state: VehicleState) =>
    state.loadedVehicleTypesMakeIds.has(makeId)
  );

export const selectIsVehicleModelsLoadedForMake = (makeId: number) =>
  createSelector(selectVehicleState, (state: VehicleState) =>
    state.loadedVehicleModelsMakeIds.has(makeId)
  );

// Filtered data selectors
export const selectFilteredVehicles = createSelector(
  selectAllVehicles,
  selectSearchTerm,
  (makes, searchTerm) => {
    if (!searchTerm) return makes;
    return makes.filter((make) =>
      make.Make_Name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
);
