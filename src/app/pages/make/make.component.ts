import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { Store } from "@ngrx/store";
import { Observable, Subject, BehaviorSubject } from "rxjs";
import { takeUntil, tap } from "rxjs/operators";
import { AppState } from "../../store/state/app.state";
import {
  loadVehicleTypesByMakeId,
  loadVehicleModelsByMakeId,
} from "../../store/actions/vehicle.actions";
import {
  selectCurrentMakeVehicleTypes,
  selectCurrentMakeVehicleModels,
  selectLoading,
} from "../../store/selectors/vehicle.selectors";
import { VehicleType } from "../../models/vehicle-type.model";
import { VehicleModel } from "../../models/vehicle-model.model";

@Component({
  selector: "app-make",
  standalone: false,
  templateUrl: "./make.component.html",
  styleUrls: ["./make.component.scss"],
})
export class MakeComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild("vehicleTypesCard", { static: false })
  vehicleTypesCard?: ElementRef;
  @ViewChild("vehicleModelsCard", { static: false })
  vehicleModelsCard?: ElementRef;

  private destroy$ = new Subject<void>();
  private makeNameSubject = new BehaviorSubject<string>("");

  // NgRx observables
  makeName$: Observable<string> = this.makeNameSubject.asObservable();
  vehicleTypes$: Observable<VehicleType[]> = this.store.select(
    selectCurrentMakeVehicleTypes
  );
  vehicleModels$: Observable<VehicleModel[]> = this.store.select(
    selectCurrentMakeVehicleModels
  );
  loading$: Observable<boolean> = this.store.select(selectLoading);

  makeId: number = 0;
  loading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.route.params
      .pipe(
        takeUntil(this.destroy$),
        tap((params: { [key: string]: string }) => {
          this.makeId = +params["id"];

          // Get make name from query params
          const makeName: string =
            this.route.snapshot.queryParams["name"] || "Unknown Make";
          this.makeNameSubject.next(makeName);

          // Load both vehicle types and models using NgRx
          this.store.dispatch(
            loadVehicleTypesByMakeId({
              makeId: this.makeId,
              makeName: makeName,
            })
          );

          this.store.dispatch(
            loadVehicleModelsByMakeId({
              makeId: this.makeId,
              makeName: makeName,
            })
          );
        })
      )
      .subscribe();

    // Subscribe to loading state
    this.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe((loading: boolean) => {
        this.loading = loading;

        // Adjust card heights after loading completes
        if (!loading) {
          setTimeout(() => this.adjustCardHeights(), 100);
        }
      });

    // Subscribe to vehicle models changes for height adjustment
    this.vehicleModels$
      .pipe(takeUntil(this.destroy$))
      .subscribe((models: VehicleModel[]) => {
        if (models.length > 0) {
          setTimeout(() => this.adjustCardHeights(), 100);
        }
      });

    // Subscribe to vehicle types changes for height adjustment
    this.vehicleTypes$
      .pipe(takeUntil(this.destroy$))
      .subscribe((types: VehicleType[]) => {
        if (types.length > 0) {
          setTimeout(() => this.adjustCardHeights(), 100);
        }
      });
  }

  ngAfterViewInit(): void {
    // Initial height adjustment
    setTimeout(() => this.adjustCardHeights(), 200);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private adjustCardHeights(): void {
    this.adjustSingleCardHeight(this.vehicleTypesCard);
    this.adjustSingleCardHeight(this.vehicleModelsCard);
  }

  private adjustSingleCardHeight(cardRef?: ElementRef): void {
    if (cardRef) {
      const cardElement: HTMLElement = cardRef.nativeElement;
      const parentContent: HTMLElement | null =
        cardElement.closest("mat-card-content");

      if (parentContent) {
        const parentHeight: number = parentContent.clientHeight;
        const maxAllowedHeight: number = parentHeight * 0.25; // 25% each card

        // Reset styles to get natural height
        cardElement.style.height = "auto";
        cardElement.style.maxHeight = "none";
        cardElement.classList.remove("scrollable");

        // Get the natural height of the content
        const naturalHeight: number = cardElement.scrollHeight;

        if (naturalHeight > maxAllowedHeight) {
          // Content exceeds 25%, apply constraints
          cardElement.style.maxHeight = `${maxAllowedHeight}px`;
          cardElement.classList.add("scrollable");
        } else {
          // Content fits within 25%, use natural height
          cardElement.style.height = `${naturalHeight}px`;
          cardElement.style.maxHeight = "none";
        }
      }
    }
  }

  goBack(): void {
    this.location.back();
  }
}
