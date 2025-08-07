import { VehicleType } from "./vehicle-type.model";

export interface VehicleTypeResponse {
  Count: number;
  Message: string;
  SearchCriteria: string;
  Results: VehicleType[];
}
