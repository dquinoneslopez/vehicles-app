import { Component, Input } from "@angular/core";
import { Observable } from "rxjs";
import { VehicleType } from "../../models/vehicle-type.model";

@Component({
  selector: "app-vehicle-types-card",
  standalone: false,
  templateUrl: "./vehicle-types-card.component.html",
  styleUrls: ["./vehicle-types-card.component.scss"],
})
export class VehicleTypesCardComponent {
  @Input() vehicleTypes$: Observable<VehicleType[]> | null = null;
  @Input() loading$: Observable<boolean> | null = null;

  trackByVehicleType(index: number, vehicle: VehicleType): number {
    return vehicle?.VehicleTypeId || index;
  }
}
