import { createReducer, on } from "@ngrx/store";
import { VehicleState, initialVehicleState } from "../state/vehicle.state";
import * as VehicleActions from "../actions/vehicle.actions";

export const vehicleReducer = createReducer(
  initialVehicleState,

  // Load Makes
  on(
    VehicleActions.loadMakes,
    (state): VehicleState => ({
      ...state,
      loading: true,
      error: null,
    })
  ),
  on(
    VehicleActions.loadMakesSuccess,
    (state, { makes }): VehicleState => ({
      ...state,
      vehicles: makes,
      loading: false,
      error: null,
    })
  ),
  on(
    VehicleActions.loadMakesFailure,
    (state, { error }): VehicleState => ({
      ...state,
      loading: false,
      error,
    })
  ),

  // Load Vehicle Types
  on(
    VehicleActions.loadVehicleTypesByMakeId,
    (state, { makeId }): VehicleState => ({
      ...state,
      loading: true,
      error: null,
      currentMakeId: makeId,
    })
  ),
  on(
    VehicleActions.loadVehicleTypesByMakeIdSuccess,
    (state, { makeId, vehicleTypes }): VehicleState => ({
      ...state,
      vehicleTypes: vehicleTypes, // Current make's types for display
      vehicleTypesForMake: {
        ...state.vehicleTypesForMake,
        [makeId]: vehicleTypes,
      },
      loadedVehicleTypesMakeIds: new Set([
        ...Array.from(state.loadedVehicleTypesMakeIds),
        makeId,
      ]),
      loading: false,
      error: null,
    })
  ),
  on(
    VehicleActions.loadVehicleTypesByMakeIdFailure,
    (state, { error }): VehicleState => ({
      ...state,
      loading: false,
      error,
    })
  ),

  // Load Vehicle Models
  on(
    VehicleActions.loadVehicleModelsByMakeId,
    (state, { makeId }): VehicleState => ({
      ...state,
      loading: true,
      error: null,
      currentMakeId: makeId,
    })
  ),
  on(
    VehicleActions.loadVehicleModelsByMakeIdSuccess,
    (state, { makeId, vehicleModels }): VehicleState => ({
      ...state,
      vehicleModels: [
        // Keep existing vehicle models from other makes, replace current make's models
        ...state.vehicleModels.filter((vm) => vm.Make_ID !== makeId),
        ...vehicleModels,
      ],
      loadedVehicleModelsMakeIds: new Set([
        ...Array.from(state.loadedVehicleModelsMakeIds),
        makeId,
      ]),
      loading: false,
      error: null,
    })
  ),
  on(
    VehicleActions.loadVehicleModelsByMakeIdFailure,
    (state, { error }): VehicleState => ({
      ...state,
      loading: false,
      error,
    })
  ),

  // Search
  on(
    VehicleActions.setSearchTerm,
    (state, { searchTerm }): VehicleState => ({
      ...state,
      searchTerm,
    })
  ),
  on(
    VehicleActions.clearSearchTerm,
    (state): VehicleState => ({
      ...state,
      searchTerm: "",
    })
  ),

  // Cache clearing
  on(
    VehicleActions.clearVehicleTypesCache,
    (state): VehicleState => ({
      ...state,
      vehicleTypes: [],
      vehicleTypesForMake: {},
      loadedVehicleTypesMakeIds: new Set(),
    })
  ),
  on(
    VehicleActions.clearVehicleModelsCache,
    (state): VehicleState => ({
      ...state,
      vehicleModels: [],
      loadedVehicleModelsMakeIds: new Set(),
    })
  ),
  on(
    VehicleActions.clearAllCache,
    (state): VehicleState => ({
      ...state,
      vehicleTypes: [],
      vehicleTypesForMake: {},
      vehicleModels: [],
      loadedVehicleTypesMakeIds: new Set(),
      loadedVehicleModelsMakeIds: new Set(),
    })
  )
);
