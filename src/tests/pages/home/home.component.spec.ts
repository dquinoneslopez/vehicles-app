import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from "@angular/core/testing";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { BehaviorSubject, of, Observable } from "rxjs";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { FormsModule } from "@angular/forms";

import { HomeComponent } from "../../../app/pages/home/home.component";
import { Make } from "../../../app/models/make.model";
import { AppState } from "../../../app/store/app.state";
import {
  loadMakes,
  setSearchTerm,
  clearSearchTerm,
} from "../../../app/store/actions/vehicle.actions";

describe("HomeComponent", (): void => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let mockStore: jasmine.SpyObj<Store<AppState>>;
  let mockRouter: jasmine.SpyObj<Router>;

  // Mock data with proper typing
  const mockBrands: Make[] = [
    { Make_ID: 1, Make_Name: "Audi" },
    { Make_ID: 2, Make_Name: "BMW" },
    { Make_ID: 3, Make_Name: "Ford" },
    { Make_ID: 4, Make_Name: "Toyota" },
    { Make_ID: 5, Make_Name: "Honda" },
  ];

  // Mock store selectors with proper typing (removed pagination-related ones)
  const allBrands$: BehaviorSubject<Make[]> = new BehaviorSubject<Make[]>([]);
  const filteredBrands$: BehaviorSubject<Make[]> = new BehaviorSubject<Make[]>(
    []
  );
  const loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  const searchTerm$: BehaviorSubject<string> = new BehaviorSubject<string>("");

  beforeEach(async (): Promise<void> => {
    const storeSpy: jasmine.SpyObj<Store<AppState>> = jasmine.createSpyObj(
      "Store",
      ["select", "dispatch"]
    );
    const routerSpy: jasmine.SpyObj<Router> = jasmine.createSpyObj("Router", [
      "navigate",
    ]);

    // Configure store selector returns with proper typing
    storeSpy.select.and.callFake((selector: any): Observable<any> => {
      if (selector.toString().includes("selectAllVehicles")) {
        return allBrands$.asObservable();
      }
      if (selector.toString().includes("selectFilteredVehicles")) {
        return filteredBrands$.asObservable();
      }
      if (selector.toString().includes("selectLoading")) {
        return loading$.asObservable();
      }
      if (selector.toString().includes("selectSearchTerm")) {
        return searchTerm$.asObservable();
      }
      return of(null);
    });

    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [
        NoopAnimationsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        ScrollingModule,
        FormsModule,
      ],
      providers: [
        { provide: Store, useValue: storeSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    mockStore = TestBed.inject(Store) as jasmine.SpyObj<Store<AppState>>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach((): void => {
    // Reset mock data (removed pagination-related resets)
    allBrands$.next([]);
    filteredBrands$.next([]);
    loading$.next(false);
    searchTerm$.next("");
  });

  afterEach((): void => {
    fixture.destroy();
  });

  describe("Component Initialization", (): void => {
    it("should create", (): void => {
      expect(component).toBeTruthy();
    });

    it("should initialize with default values", (): void => {
      expect(component.searchTerm).toBe("");
      expect(component.loading).toBe(false);
      // Removed pagination property checks
    });

    it("should setup store selectors", (): void => {
      fixture.detectChanges();

      expect(mockStore.select).toHaveBeenCalledTimes(4); // Reduced from 6 to 4
    });

    it("should not have pagination-related properties", (): void => {
      expect(component.hasOwnProperty("hasMoreData")).toBe(false);
      expect(component.hasOwnProperty("currentPage")).toBe(false);
      expect(component.hasOwnProperty("hasMoreData$")).toBe(false);
      expect(component.hasOwnProperty("currentPage$")).toBe(false);
    });
  });

  describe("Data Loading", (): void => {
    it("should dispatch loadMakes on init when no brands are loaded", (): void => {
      allBrands$.next([]);

      component.ngOnInit();

      expect(mockStore.dispatch).toHaveBeenCalledWith(loadMakes());
    });

    it("should not dispatch loadMakes when brands are already loaded", (): void => {
      allBrands$.next(mockBrands);

      component.ngOnInit();

      expect(mockStore.dispatch).not.toHaveBeenCalledWith(loadMakes());
    });

    it("should not dispatch loadMakes when hasInitiallyLoaded is true", fakeAsync((): void => {
      // First load brands to set hasInitiallyLoaded
      allBrands$.next(mockBrands);
      fixture.detectChanges();
      tick();

      // Reset brands to empty and try to init again
      allBrands$.next([]);
      tick();

      mockStore.dispatch.calls.reset();

      component.ngOnInit();

      expect(mockStore.dispatch).not.toHaveBeenCalledWith(loadMakes());
    }));

    it("should update loading state from store", fakeAsync((): void => {
      fixture.detectChanges();

      loading$.next(true);
      tick();

      expect(component.loading).toBe(true);

      loading$.next(false);
      tick();

      expect(component.loading).toBe(false);
    }));

    it("should update brands data from store", fakeAsync((): void => {
      fixture.detectChanges();

      allBrands$.next(mockBrands);
      tick();

      component.allBrands$.subscribe((brands: Make[]): void => {
        expect(brands).toEqual(mockBrands);
        expect(brands.length).toBe(5);
      });
    }));

    it("should set hasInitiallyLoaded flag when brands are loaded", fakeAsync((): void => {
      fixture.detectChanges();

      allBrands$.next(mockBrands);
      tick();

      expect((component as any)["hasInitiallyLoaded"]).toBe(true);
    }));
  });

  describe("Search Functionality", (): void => {
    beforeEach((): void => {
      fixture.detectChanges();
    });

    it("should update search term when input changes", fakeAsync((): void => {
      const inputElement: HTMLInputElement =
        fixture.debugElement.nativeElement.querySelector("input");

      inputElement.value = "Ford";
      inputElement.dispatchEvent(new Event("input"));

      tick(300); // Wait for debounce

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        setSearchTerm({ searchTerm: "Ford" })
      );
    }));

    it("should update local searchTerm immediately on input change", (): void => {
      const event: Event = new Event("input");
      Object.defineProperty(event, "target", {
        value: { value: "Ford" } as HTMLInputElement,
      });

      component.onSearchChange(event);

      expect(component.searchTerm).toBe("Ford");
    });

    it("should debounce search input", fakeAsync((): void => {
      const inputElement: HTMLInputElement =
        fixture.debugElement.nativeElement.querySelector("input");

      // Simulate rapid typing
      inputElement.value = "F";
      inputElement.dispatchEvent(new Event("input"));
      tick(100);

      inputElement.value = "Fo";
      inputElement.dispatchEvent(new Event("input"));
      tick(100);

      inputElement.value = "Ford";
      inputElement.dispatchEvent(new Event("input"));
      tick(300);

      // Should only dispatch once with final value
      expect(mockStore.dispatch).toHaveBeenCalledTimes(1);
      expect(mockStore.dispatch).toHaveBeenCalledWith(
        setSearchTerm({ searchTerm: "Ford" })
      );
    }));

    it("should clear search when clearSearch is called", (): void => {
      component.searchTerm = "Ford";

      component.clearSearch();

      expect(component.searchTerm).toBe("");
      expect(mockStore.dispatch).toHaveBeenCalledWith(clearSearchTerm());
    });

    it("should update search term from store", fakeAsync((): void => {
      searchTerm$.next("Toyota");
      tick();

      expect(component.searchTerm).toBe("Toyota");
    }));
  });

  describe("Brand Navigation", (): void => {
    it("should navigate to brand page when brand is clicked", (): void => {
      const mockBrand: Make = mockBrands[0]; // Audi

      component.onBrandClick(mockBrand);

      expect(mockRouter.navigate).toHaveBeenCalledWith(["/brand", 1], {
        queryParams: {
          name: "Audi",
        },
      });
    });
  });

  describe("Virtual Scrolling", (): void => {
    it("should track brands by ID", (): void => {
      const mockBrand: Make = mockBrands[0];

      const result: number = component.trackByBrand(0, mockBrand);

      expect(result).toBe(1); // Make_ID
    });

    it("should fallback to index when brand has no ID", (): void => {
      const mockBrandWithoutId: Make = {
        Make_ID: 0,
        Make_Name: "Unknown",
      } as Make;

      const result: number = component.trackByBrand(5, mockBrandWithoutId);

      expect(result).toBe(5); // fallback to index
    });
  });

  describe("Component Lifecycle", (): void => {
    it("should complete destroy subject on destroy", (): void => {
      const destroySpy: jasmine.Spy = spyOn(
        (component as any)["destroy$"],
        "next"
      );
      const completeSpy: jasmine.Spy = spyOn(
        (component as any)["destroy$"],
        "complete"
      );

      component.ngOnDestroy();

      expect(destroySpy).toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
    });
  });

  describe("Loading States", (): void => {
    beforeEach((): void => {
      fixture.detectChanges();
    });

    it("should show initial loading when loading and no brands", fakeAsync((): void => {
      loading$.next(true);
      allBrands$.next([]);
      tick();

      component.isInitialLoading$.subscribe((isLoading: boolean): void => {
        expect(isLoading).toBe(true);
      });
    }));

    it("should not show initial loading when brands are loaded", fakeAsync((): void => {
      loading$.next(true);
      allBrands$.next(mockBrands);
      tick();

      component.isInitialLoading$.subscribe((isLoading: boolean): void => {
        expect(isLoading).toBe(false);
      });
    }));
  });

  describe("Template Integration", (): void => {
    beforeEach((): void => {
      fixture.detectChanges();
    });

    it("should display search input", (): void => {
      const searchInput: HTMLInputElement | null =
        fixture.debugElement.nativeElement.querySelector("input[matInput]");
      expect(searchInput).toBeTruthy();
    });

    it("should show clear search button when search term exists", fakeAsync((): void => {
      component.searchTerm = "Ford";
      fixture.detectChanges();
      tick();

      const clearButton: HTMLButtonElement | null =
        fixture.debugElement.nativeElement.querySelector("button[matSuffix]");
      expect(clearButton).toBeTruthy();
    }));

    it("should show loading spinner when initially loading", fakeAsync((): void => {
      loading$.next(true);
      allBrands$.next([]);
      tick();
      fixture.detectChanges();

      const spinner: HTMLElement | null =
        fixture.debugElement.nativeElement.querySelector("mat-spinner");
      expect(spinner).toBeTruthy();
    }));
  });

  describe("Error Handling", (): void => {
    it("should handle null/undefined brands gracefully", (): void => {
      expect((): void => {
        component.trackByBrand(0, null as any);
      }).not.toThrow();
    });

    it("should handle empty search term gracefully", fakeAsync((): void => {
      const inputElement: HTMLInputElement =
        fixture.debugElement.nativeElement.querySelector("input");

      inputElement.value = "";
      inputElement.dispatchEvent(new Event("input"));
      tick(300);

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        setSearchTerm({ searchTerm: "" })
      );
    }));

    it("should handle invalid event target in onSearchChange", (): void => {
      const event: Event = {} as Event;

      expect((): void => {
        component.onSearchChange(event);
      }).not.toThrow();
    });

    it("should handle null/undefined Make objects gracefully", (): void => {
      const undefinedMake: Make | undefined = undefined;

      expect((): void => {
        component.trackByBrand(0, undefinedMake as any);
      }).not.toThrow();
    });
  });

  describe("Component Properties", (): void => {
    it("should have all required observables", (): void => {
      expect(component.allBrands$).toBeDefined();
      expect(component.filteredBrands$).toBeDefined();
      expect(component.loading$).toBeDefined();
      expect(component.searchTerm$).toBeDefined();
      expect(component.isInitialLoading$).toBeDefined();
    });

    it("should have observables with correct types", (): void => {
      expect(component.allBrands$).toEqual(jasmine.any(Observable));
      expect(component.filteredBrands$).toEqual(jasmine.any(Observable));
      expect(component.loading$).toEqual(jasmine.any(Observable));
      expect(component.searchTerm$).toEqual(jasmine.any(Observable));
      expect(component.isInitialLoading$).toEqual(jasmine.any(Observable));
    });

    it("should unsubscribe from all observables on destroy", (): void => {
      const destroyNextSpy: jasmine.Spy = spyOn(
        (component as any)["destroy$"],
        "next"
      );
      const destroyCompleteSpy: jasmine.Spy = spyOn(
        (component as any)["destroy$"],
        "complete"
      );

      component.ngOnDestroy();

      expect(destroyNextSpy).toHaveBeenCalled();
      expect(destroyCompleteSpy).toHaveBeenCalled();
    });
  });

  describe("Type Safety", (): void => {
    it("should handle string searchTerm property", (): void => {
      component.searchTerm = "Test";
      expect(typeof component.searchTerm).toBe("string");
    });

    it("should handle boolean loading property", (): void => {
      component.loading = true;
      expect(typeof component.loading).toBe("boolean");
    });
  });
});
