import { Component, Input } from "@angular/core";
import { Observable } from "rxjs";
import { VehicleModel } from "../../models/vehicle-model.model";

@Component({
  selector: "app-vehicle-models-card",
  standalone: false,
  templateUrl: "./vehicle-models-card.component.html",
  styleUrls: ["./vehicle-models-card.component.scss"],
})
export class VehicleModelsCardComponent {
  @Input() vehicleModels$: Observable<VehicleModel[]> | null = null;
  @Input() loading$: Observable<boolean> | null = null;

  trackByVehicleModel(index: number, model: VehicleModel): number {
    return model?.Model_ID || index;
  }
}
