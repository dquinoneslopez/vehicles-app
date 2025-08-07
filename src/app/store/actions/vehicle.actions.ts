import { createAction, props } from "@ngrx/store";
import { Make } from "../../models/make.model";
import { VehicleType } from "../../models/vehicle-type.model";
import { VehicleModel } from "../../models/vehicle-model.model";

// Load Makes
export const loadMakes = createAction("[Vehicle] Load Makes");
export const loadMakesSuccess = createAction(
  "[Vehicle] Load Makes Success",
  props<{ makes: Make[] }>()
);
export const loadMakesFailure = createAction(
  "[Vehicle] Load Makes Failure",
  props<{ error: string }>()
);

// Load Vehicle Types
export const loadVehicleTypesByMakeId = createAction(
  "[Vehicle] Load Vehicle Types By Make ID",
  props<{ makeId: number; makeName: string }>()
);
export const loadVehicleTypesByMakeIdSuccess = createAction(
  "[Vehicle] Load Vehicle Types By Make ID Success",
  props<{ makeId: number; vehicleTypes: VehicleType[] }>()
);
export const loadVehicleTypesByMakeIdFailure = createAction(
  "[Vehicle] Load Vehicle Types By Make ID Failure",
  props<{ error: string }>()
);

// Load Vehicle Models
export const loadVehicleModelsByMakeId = createAction(
  "[Vehicle] Load Vehicle Models By Make ID",
  props<{ makeId: number; makeName: string }>()
);
export const loadVehicleModelsByMakeIdSuccess = createAction(
  "[Vehicle] Load Vehicle Models By Make ID Success",
  props<{ makeId: number; vehicleModels: VehicleModel[] }>()
);
export const loadVehicleModelsByMakeIdFailure = createAction(
  "[Vehicle] Load Vehicle Models By Make ID Failure",
  props<{ error: string }>()
);

// Search
export const setSearchTerm = createAction(
  "[Vehicle] Set Search Term",
  props<{ searchTerm: string }>()
);
export const clearSearchTerm = createAction("[Vehicle] Clear Search Term");

// Cache management
export const clearVehicleTypesCache = createAction(
  "[Vehicle] Clear Vehicle Types Cache"
);
export const clearVehicleModelsCache = createAction(
  "[Vehicle] Clear Vehicle Models Cache"
);
export const clearAllCache = createAction("[Vehicle] Clear All Cache");
