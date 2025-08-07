import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { Store } from "@ngrx/store";
import { BehaviorSubject, of } from "rxjs";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

import { BrandComponent } from "../../../app/pages/brand/brand.component";
import { VehicleType } from "../../../app/models/vehicle-type.model";
import { VehicleModel } from "../../../app/models/vehicle-model.model";
import { AppState } from "../../../app/store/state/app.state";
import {
  loadVehicleTypesByMakeId,
  loadVehicleModelsByMakeId,
} from "../../../app/store/actions/vehicle.actions";

describe("BrandComponent", (): void => {
  let component: BrandComponent;
  let fixture: ComponentFixture<BrandComponent>;
  let mockStore: jasmine.SpyObj<Store<AppState>>;
  let mockLocation: jasmine.SpyObj<Location>;
  let mockActivatedRoute: any;

  // Mock data
  const mockVehicleTypes: VehicleType[] = [
    { VehicleTypeId: 1, VehicleTypeName: "Passenger Car" },
    { VehicleTypeId: 2, VehicleTypeName: "Truck" },
  ];

  const mockVehicleModels: VehicleModel[] = [
    { Model_ID: 1, Model_Name: "A4", Make_ID: 440, Make_Name: "Audi" },
    { Model_ID: 2, Model_Name: "A6", Make_ID: 440, Make_Name: "Audi" },
    { Model_ID: 3, Model_Name: "Q5", Make_ID: 440, Make_Name: "Audi" },
  ];

  // Mock observables
  const vehicleTypes$ = new BehaviorSubject<VehicleType[]>([]);
  const vehicleModels$ = new BehaviorSubject<VehicleModel[]>([]);
  const loading$ = new BehaviorSubject<boolean>(false);
  const params$ = new BehaviorSubject<any>({ id: "440" });

  beforeEach(async (): Promise<void> => {
    const storeSpy = jasmine.createSpyObj("Store", ["select", "dispatch"]);
    const locationSpy = jasmine.createSpyObj("Location", ["back"]);

    mockActivatedRoute = {
      params: params$.asObservable(),
      snapshot: {
        queryParams: { name: "Audi" },
      },
    };

    // Configure store selector returns
    storeSpy.select.and.callFake((selector: any) => {
      if (selector.toString().includes("selectCurrentMakeVehicleTypes")) {
        return vehicleTypes$.asObservable();
      }
      if (selector.toString().includes("selectCurrentMakeVehicleModels")) {
        return vehicleModels$.asObservable();
      }
      if (selector.toString().includes("selectLoading")) {
        return loading$.asObservable();
      }
      return of(null);
    });

    await TestBed.configureTestingModule({
      declarations: [BrandComponent],
      imports: [
        NoopAnimationsModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule,
      ],
      providers: [
        { provide: Store, useValue: storeSpy },
        { provide: Location, useValue: locationSpy },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BrandComponent);
    component = fixture.componentInstance;
    mockStore = TestBed.inject(Store) as jasmine.SpyObj<Store<AppState>>;
    mockLocation = TestBed.inject(Location) as jasmine.SpyObj<Location>;
  });

  beforeEach((): void => {
    // Reset mock data
    vehicleTypes$.next([]);
    vehicleModels$.next([]);
    loading$.next(false);
    params$.next({ id: "440" });
  });

  afterEach((): void => {
    fixture.destroy();
  });

  describe("Component Initialization", (): void => {
    it("should create", (): void => {
      expect(component).toBeTruthy();
    });

    it("should initialize with default values", (): void => {
      expect(component.makeId).toBe(0);
      expect(component.loading).toBe(false);
    });

    it("should setup NgRx observables", (): void => {
      fixture.detectChanges();

      expect(mockStore.select).toHaveBeenCalledTimes(3);
      expect(component.vehicleTypes$).toBeDefined();
      expect(component.vehicleModels$).toBeDefined();
      expect(component.loading$).toBeDefined();
    });
  });

  describe("Route Parameter Handling", (): void => {
    it("should extract makeId from route params", fakeAsync((): void => {
      params$.next({ id: "440" });

      component.ngOnInit();
      tick();

      expect(component.makeId).toBe(440);
    }));

    it("should extract brand name from query params", fakeAsync((): void => {
      mockActivatedRoute.snapshot.queryParams = { name: "BMW" };

      component.ngOnInit();
      tick();

      component.brandName$.subscribe((name: string): void => {
        expect(name).toBe("BMW");
      });
    }));

    it("should use default brand name when query param is missing", fakeAsync((): void => {
      mockActivatedRoute.snapshot.queryParams = {};

      component.ngOnInit();
      tick();

      component.brandName$.subscribe((name: string): void => {
        expect(name).toBe("Unknown Brand");
      });
    }));

    it("should dispatch load actions with correct parameters", fakeAsync((): void => {
      params$.next({ id: "440" });
      mockActivatedRoute.snapshot.queryParams = { name: "Audi" };

      component.ngOnInit();
      tick();

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        loadVehicleTypesByMakeId({
          makeId: 440,
          makeName: "Audi",
        })
      );

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        loadVehicleModelsByMakeId({
          makeId: 440,
          makeName: "Audi",
        })
      );
    }));
  });

  describe("Data Loading and State Management", (): void => {
    beforeEach((): void => {
      fixture.detectChanges();
    });

    it("should update loading state from store", fakeAsync((): void => {
      loading$.next(true);
      tick();

      expect(component.loading).toBe(true);

      loading$.next(false);
      tick();

      expect(component.loading).toBe(false);
    }));

    it("should receive vehicle types from store", fakeAsync((): void => {
      vehicleTypes$.next(mockVehicleTypes);
      tick();

      component.vehicleTypes$.subscribe((types: VehicleType[]): void => {
        expect(types).toEqual(mockVehicleTypes);
        expect(types.length).toBe(2);
      });
    }));

    it("should receive vehicle models from store", fakeAsync((): void => {
      vehicleModels$.next(mockVehicleModels);
      tick();

      component.vehicleModels$.subscribe((models: VehicleModel[]): void => {
        expect(models).toEqual(mockVehicleModels);
        expect(models.length).toBe(3);
      });
    }));
  });

  describe("Card Height Adjustment", (): void => {
    let mockCardElement: HTMLElement;
    let mockParentElement: HTMLElement;

    beforeEach((): void => {
      // Create mock DOM elements
      mockCardElement = document.createElement("div");
      mockParentElement = document.createElement("div");

      // Setup parent-child relationship
      mockParentElement.appendChild(mockCardElement);

      // Mock properties
      Object.defineProperty(mockParentElement, "clientHeight", {
        value: 400,
        configurable: true,
      });

      Object.defineProperty(mockCardElement, "scrollHeight", {
        value: 200,
        configurable: true,
      });

      // Mock closest method
      spyOn(mockCardElement, "closest").and.returnValue(mockParentElement);

      fixture.detectChanges();
    });

    it("should adjust card height when content fits within limit", (): void => {
      component["adjustSingleCardHeight"]({ nativeElement: mockCardElement });

      expect(mockCardElement.style.height).toBe("200px");
      expect(mockCardElement.style.maxHeight).toBe("none");
      expect(mockCardElement.classList.contains("scrollable")).toBe(false);
    });

    it("should apply scrollable styles when content exceeds limit", (): void => {
      // Make content exceed 25% of parent (100px)
      Object.defineProperty(mockCardElement, "scrollHeight", {
        value: 150,
        configurable: true,
      });

      component["adjustSingleCardHeight"]({ nativeElement: mockCardElement });

      expect(mockCardElement.style.maxHeight).toBe("100px");
      expect(mockCardElement.classList.contains("scrollable")).toBe(true);
    });

    it("should handle missing card reference gracefully", (): void => {
      expect((): void => {
        component["adjustSingleCardHeight"](undefined);
      }).not.toThrow();
    });

    it("should call adjustCardHeights after loading completes", fakeAsync((): void => {
      spyOn(component as any, "adjustCardHeights");

      loading$.next(true);
      tick();
      loading$.next(false);
      tick(100);

      expect((component as any).adjustCardHeights).toHaveBeenCalled();
    }));
  });

  describe("Navigation", (): void => {
    it("should call location.back() when goBack is called", (): void => {
      component.goBack();

      expect(mockLocation.back).toHaveBeenCalled();
    });
  });

  describe("Component Lifecycle", (): void => {
    it("should complete destroy subject on destroy", (): void => {
      const destroySpy = spyOn((component as any)["destroy$"], "next");
      const completeSpy = spyOn((component as any)["destroy$"], "complete");

      component.ngOnDestroy();

      expect(destroySpy).toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
    });

    it("should call adjustCardHeights after view init", fakeAsync((): void => {
      spyOn(component as any, "adjustCardHeights");

      component.ngAfterViewInit();
      tick(200);

      expect((component as any).adjustCardHeights).toHaveBeenCalled();
    }));

    it("should unsubscribe from observables on destroy", (): void => {
      const mockSubscription = jasmine.createSpy("unsubscribe");
      (component as any)["destroy$"] = {
        next: jasmine.createSpy("next"),
        complete: jasmine.createSpy("complete"),
      };

      component.ngOnDestroy();

      expect((component as any)["destroy$"].next).toHaveBeenCalled();
      expect((component as any)["destroy$"].complete).toHaveBeenCalled();
    });
  });

  describe("Error Handling", (): void => {
    it("should handle invalid route parameters", fakeAsync((): void => {
      params$.next({ id: "invalid" });

      component.ngOnInit();
      tick();

      expect(component.makeId).toBe(0); // NaN becomes 0 with +
    }));

    it("should handle missing route parameters", fakeAsync((): void => {
      params$.next({});

      component.ngOnInit();
      tick();

      expect(component.makeId).toBe(0);
    }));
  });

  describe("Integration Tests", (): void => {
    it("should handle complete data loading flow", fakeAsync((): void => {
      // Start loading
      loading$.next(true);
      tick();
      expect(component.loading).toBe(true);

      // Load vehicle types
      vehicleTypes$.next(mockVehicleTypes);
      tick();

      // Load vehicle models
      vehicleModels$.next(mockVehicleModels);
      tick();

      // Complete loading
      loading$.next(false);
      tick(100);

      expect(component.loading).toBe(false);

      component.vehicleTypes$.subscribe((types) => {
        expect(types.length).toBe(2);
      });

      component.vehicleModels$.subscribe((models) => {
        expect(models.length).toBe(3);
      });
    }));

    it("should dispatch actions and handle data updates", fakeAsync((): void => {
      params$.next({ id: "440" });
      mockActivatedRoute.snapshot.queryParams = { name: "Audi" };

      component.ngOnInit();
      tick();

      // Verify actions were dispatched
      expect(mockStore.dispatch).toHaveBeenCalledTimes(2);

      // Simulate data loading
      vehicleTypes$.next(mockVehicleTypes);
      vehicleModels$.next(mockVehicleModels);
      tick();

      // Verify component receives the data
      component.vehicleTypes$.subscribe((types) => {
        expect(types).toEqual(mockVehicleTypes);
      });

      component.vehicleModels$.subscribe((models) => {
        expect(models).toEqual(mockVehicleModels);
      });
    }));
  });
});
