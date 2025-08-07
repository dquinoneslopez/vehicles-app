import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { Make } from "../models/make.model";
import { VehicleType } from "../models/vehicle-type.model";
import { VehicleModel } from "../models/vehicle-model.model";

// API Response interfaces for better typing
interface ApiResponse<T> {
  Count: number;
  Message: string;
  Results: T[];
  SearchCriteria: string | null;
}

@Injectable({
  providedIn: "root",
})
export class VehicleService {
  private readonly baseUrl = "https://vpic.nhtsa.dot.gov/api";

  constructor(private http: HttpClient) {}

  getAllMakes(): Observable<Make[]> {
    return this.http
      .get<ApiResponse<Make>>(
        `${this.baseUrl}/vehicles/getallmakes?format=json`
      )
      .pipe(
        map((response: ApiResponse<Make>) => response.Results),
        catchError((error) => {
          console.error("Error fetching vehicle makes:", error);
          throw error;
        })
      );
  }

  getVehicleTypesForMakeId(makeId: number): Observable<VehicleType[]> {
    if (!makeId || makeId <= 0) {
      throw new Error("Invalid makeId provided");
    }

    return this.http
      .get<ApiResponse<VehicleType>>(
        `${this.baseUrl}/vehicles/GetVehicleTypesForMakeId/${makeId}?format=json`
      )
      .pipe(
        map((response: ApiResponse<VehicleType>) => response.Results),
        catchError((error) => {
          console.error(
            `Error fetching vehicle types for make ${makeId}:`,
            error
          );
          throw error;
        })
      );
  }

  getVehicleModelsForMakeId(makeId: number): Observable<VehicleModel[]> {
    if (!makeId || makeId <= 0) {
      throw new Error("Invalid makeId provided");
    }

    return this.http
      .get<ApiResponse<VehicleModel>>(
        `${this.baseUrl}/vehicles/GetModelsForMakeId/${makeId}?format=json`
      )
      .pipe(
        map((response: ApiResponse<VehicleModel>) => response.Results),
        catchError((error) => {
          console.error(
            `Error fetching vehicle models for make ${makeId}:`,
            error
          );
          throw error;
        })
      );
  }
}
