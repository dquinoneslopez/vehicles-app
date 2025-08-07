import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { of, EMPTY } from "rxjs";
import { map, catchError, switchMap, concatMap, take } from "rxjs/operators";
import { VehicleService } from "../../services/vehicle.service";
import { AppState } from "../state/app.state";
import { Make } from "../../models/make.model";
import { VehicleType } from "../../models/vehicle-type.model";
import { VehicleModel } from "../../models/vehicle-model.model";
import * as VehicleActions from "../actions/vehicle.actions";
import {
  selectIsVehicleTypesLoadedForMake,
  selectIsVehicleModelsLoadedForMake,
} from "../selectors/vehicle.selectors";

@Injectable()
export class VehicleEffects {
  constructor(
    private actions$: Actions,
    private vehicleService: VehicleService,
    private store: Store<AppState>
  ) {}

  // Load Makes Effect
  loadMakes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VehicleActions.loadMakes),
      switchMap(() =>
        this.vehicleService.getAllMakes().pipe(
          map((makes: Make[]) =>
            VehicleActions.loadMakesSuccess({
              makes: makes,
            })
          ),
          catchError((error: any) =>
            of(
              VehicleActions.loadMakesFailure({
                error: error.message || "Failed to load makes",
              })
            )
          )
        )
      )
    )
  );

  // Load Vehicle Types Effect with caching
  loadVehicleTypesByMakeId$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VehicleActions.loadVehicleTypesByMakeId),
      concatMap((action) =>
        this.store
          .select(selectIsVehicleTypesLoadedForMake(action.makeId))
          .pipe(
            take(1),
            switchMap((isAlreadyLoaded: boolean) => {
              if (isAlreadyLoaded) {
                return EMPTY;
              }

              return this.vehicleService
                .getVehicleTypesForMakeId(action.makeId)
                .pipe(
                  map((vehicleTypes: VehicleType[]) =>
                    VehicleActions.loadVehicleTypesByMakeIdSuccess({
                      makeId: action.makeId,
                      vehicleTypes,
                    })
                  ),
                  catchError((error: any) =>
                    of(
                      VehicleActions.loadVehicleTypesByMakeIdFailure({
                        error: error.message || "Failed to load vehicle types",
                      })
                    )
                  )
                );
            })
          )
      )
    )
  );

  // Load Vehicle Models Effect with caching
  loadVehicleModelsByMakeId$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VehicleActions.loadVehicleModelsByMakeId),
      concatMap((action) =>
        this.store
          .select(selectIsVehicleModelsLoadedForMake(action.makeId))
          .pipe(
            take(1),
            switchMap((isAlreadyLoaded: boolean) => {
              if (isAlreadyLoaded) {
                return EMPTY;
              }

              return this.vehicleService
                .getVehicleModelsForMakeId(action.makeId)
                .pipe(
                  map((vehicleModels: VehicleModel[]) =>
                    VehicleActions.loadVehicleModelsByMakeIdSuccess({
                      makeId: action.makeId,
                      vehicleModels,
                    })
                  ),
                  catchError((error: any) =>
                    of(
                      VehicleActions.loadVehicleModelsByMakeIdFailure({
                        error: error.message || "Failed to load vehicle models",
                      })
                    )
                  )
                );
            })
          )
      )
    )
  );
}
