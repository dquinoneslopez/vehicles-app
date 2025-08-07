import { VehicleModel } from "./vehicle-model.model";

export interface VehicleModelResponse {
  Count: number;
  Message: string;
  SearchCriteria: string;
  Results: VehicleModel[];
}
