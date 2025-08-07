import { Make } from "../../models/make.model";
import { VehicleType } from "../../models/vehicle-type.model";
import { VehicleModel } from "../../models/vehicle-model.model";

export interface VehicleState {
  vehicles: Make[];
  vehicleTypes: VehicleType[];
  vehicleModels: VehicleModel[];

  // Store vehicle types by make ID
  vehicleTypesForMake: { [makeId: number]: VehicleType[] };

  // Cache tracking
  loadedVehicleTypesMakeIds: Set<number>;
  loadedVehicleModelsMakeIds: Set<number>;

  // Current context
  currentMakeId: number | null;

  // UI state
  loading: boolean;
  error: string | null;
  searchTerm: string;
}

export const initialVehicleState: VehicleState = {
  vehicles: [],
  vehicleTypes: [],
  vehicleModels: [],
  vehicleTypesForMake: {},
  loadedVehicleTypesMakeIds: new Set(),
  loadedVehicleModelsMakeIds: new Set(),
  currentMakeId: null,
  loading: false,
  error: null,
  searchTerm: "",
};
