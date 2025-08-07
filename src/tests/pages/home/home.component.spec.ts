import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
  flush,
} from "@angular/core/testing";
import { provideMockStore, MockStore } from "@ngrx/store/testing";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { RouterTestingModule } from "@angular/router/testing";
import { Router } from "@angular/router";
import { take } from "rxjs/operators";

import { HomeComponent } from "../../../app/pages/home/home.component";
import { Make } from "../../../app/models/make.model";
import {
  loadMakes,
  setSearchTerm,
  clearSearchTerm,
} from "../../../app/store/actions/vehicle.actions";

describe("HomeComponent", () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let mockStore: MockStore;
  let router: Router;

  const mockMakes: Make[] = [
    { Make_ID: 440, Make_Name: "Audi" },
    { Make_ID: 441, Make_Name: "BMW" },
    { Make_ID: 442, Make_Name: "Mercedes" },
    { Make_ID: 443, Make_Name: "Ford" },
  ];

  const initialState = {
    vehicles: {
      vehicles: mockMakes, // Put the makes here instead of empty array
      vehicleTypes: [],
      vehicleModels: [],
      vehicleTypesForMake: {},
      loadedVehicleTypesMakeIds: new Set(),
      loadedVehicleModelsMakeIds: new Set(),
      currentMakeId: null,
      loading: false,
      error: null,
      searchTerm: "",
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [
        NoopAnimationsModule,
        MatToolbarModule,
        MatFormFieldModule,
        MatInputModule,
        MatProgressSpinnerModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        ScrollingModule,
        RouterTestingModule,
      ],
      providers: [provideMockStore({ initialState })],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    mockStore = TestBed.inject(MockStore);
    router = TestBed.inject(Router);

    spyOn(mockStore, "dispatch").and.callThrough();
    spyOn(router, "navigate");
  });

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
    mockStore?.resetSelectors();
  });

  describe("Component Initialization", () => {
    it("should create", () => {
      expect(component).toBeTruthy();
    });

    it("should initialize with default values", () => {
      // Since the component starts with mockMakes in initialState,
      // hasInitiallyLoaded will be true after component creation
      expect(component.hasInitiallyLoaded).toBe(true);
    });
  });

  describe("Data Loading", () => {
    it("should dispatch loadMakes on init when no makes are loaded", fakeAsync(async () => {
      // Create a new initial state with empty vehicles
      const emptyState = {
        vehicles: {
          ...initialState.vehicles,
          vehicles: [], // Empty vehicles array
        },
      };

      // Reinitialize the store with empty state
      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        declarations: [HomeComponent],
        imports: [
          NoopAnimationsModule,
          MatToolbarModule,
          MatFormFieldModule,
          MatInputModule,
          MatProgressSpinnerModule,
          MatCardModule,
          MatButtonModule,
          MatIconModule,
          ScrollingModule,
          RouterTestingModule,
        ],
        providers: [provideMockStore({ initialState: emptyState })],
      }).compileComponents();

      fixture = TestBed.createComponent(HomeComponent);
      component = fixture.componentInstance;
      mockStore = TestBed.inject(MockStore);
      spyOn(mockStore, "dispatch").and.callThrough();

      component.ngOnInit();
      tick();

      expect(mockStore.dispatch).toHaveBeenCalledWith(loadMakes());
      flush();
    }));

    it("should update makes data from store", fakeAsync(() => {
      component.ngOnInit();
      tick();

      // Test the observable directly - the initial state already has mockMakes
      let receivedMakes: Make[] = [];
      component.allMakes$.pipe(take(1)).subscribe((makes: Make[]) => {
        receivedMakes = makes;
      });
      tick();

      expect(receivedMakes).toEqual(mockMakes);
      expect(receivedMakes.length).toBe(4);
      flush();
    }));

    it("should update loading state from store", async () => {
      // Test with loading true
      const loadingState = {
        vehicles: {
          ...initialState.vehicles,
          loading: true,
        },
      };

      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        declarations: [HomeComponent],
        imports: [
          NoopAnimationsModule,
          MatToolbarModule,
          MatFormFieldModule,
          MatInputModule,
          MatProgressSpinnerModule,
          MatCardModule,
          MatButtonModule,
          MatIconModule,
          ScrollingModule,
          RouterTestingModule,
        ],
        providers: [provideMockStore({ initialState: loadingState })],
      }).compileComponents();

      fixture = TestBed.createComponent(HomeComponent);
      component = fixture.componentInstance;

      component.ngOnInit();

      let loadingValue: boolean = false;
      component.loading$.pipe(take(1)).subscribe((loading: boolean) => {
        loadingValue = loading;
      });

      expect(loadingValue).toBe(true);
    });

    it("should set hasInitiallyLoaded flag when makes are loaded", fakeAsync(() => {
      // Start with component that has makes
      component.ngOnInit();
      tick();

      // Since we start with makes in initial state, the flag should be set
      expect(component.hasInitiallyLoaded).toBe(true);
      flush();
    }));
  });

  describe("Search Functionality", () => {
    beforeEach(fakeAsync(() => {
      component.ngOnInit();
      tick();
      fixture.detectChanges();
      flush();
    }));

    it("should update search term from store", fakeAsync(async () => {
      // Test with search term in initial state
      const searchState = {
        vehicles: {
          ...initialState.vehicles,
          searchTerm: "Toyota",
        },
      };

      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        declarations: [HomeComponent],
        imports: [
          NoopAnimationsModule,
          MatToolbarModule,
          MatFormFieldModule,
          MatInputModule,
          MatProgressSpinnerModule,
          MatCardModule,
          MatButtonModule,
          MatIconModule,
          ScrollingModule,
          RouterTestingModule,
        ],
        providers: [provideMockStore({ initialState: searchState })],
      }).compileComponents();

      fixture = TestBed.createComponent(HomeComponent);
      component = fixture.componentInstance;

      component.ngOnInit();
      tick();

      let searchTerm: string = "";
      component.searchTerm$.pipe(take(1)).subscribe((term: string) => {
        searchTerm = term;
      });
      tick();

      expect(searchTerm).toBe("Toyota");
      flush();
    }));

    it("should dispatch setSearchTerm when search term changes", fakeAsync(() => {
      const searchTerm = "BMW";
      const mockEvent = { target: { value: searchTerm } } as unknown as Event;

      component.onSearchChange(mockEvent);
      tick(300); // Wait for debounce

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        setSearchTerm({ searchTerm })
      );

      flush();
    }));

    it("should clear search term", () => {
      component.searchTerm = "BMW";
      component.clearSearch();

      expect(mockStore.dispatch).toHaveBeenCalledWith(clearSearchTerm());
    });
  });

  describe("Loading States", () => {
    it("should show initial loading when loading and no makes", fakeAsync(async () => {
      // Create state with loading true and no vehicles
      const loadingState = {
        vehicles: {
          ...initialState.vehicles,
          loading: true,
          vehicles: [],
        },
      };

      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        declarations: [HomeComponent],
        imports: [
          NoopAnimationsModule,
          MatToolbarModule,
          MatFormFieldModule,
          MatInputModule,
          MatProgressSpinnerModule,
          MatCardModule,
          MatButtonModule,
          MatIconModule,
          ScrollingModule,
          RouterTestingModule,
        ],
        providers: [provideMockStore({ initialState: loadingState })],
      }).compileComponents();

      fixture = TestBed.createComponent(HomeComponent);
      component = fixture.componentInstance;

      component.ngOnInit();
      tick();
      fixture.detectChanges();

      let isInitialLoading: boolean = false;
      component.isInitialLoading$.pipe(take(1)).subscribe((show: boolean) => {
        isInitialLoading = show;
      });
      tick();

      expect(isInitialLoading).toBe(true);

      // Check if there's any loading element in the template
      const loadingElement = fixture.debugElement.nativeElement.querySelector(
        "mat-spinner, .loading, [data-testid='loading']"
      );
      expect(loadingElement).toBeTruthy();

      flush();
    }));

    it("should not show initial loading when makes are loaded", fakeAsync(() => {
      component.ngOnInit();
      tick();
      fixture.detectChanges();

      let isInitialLoading: boolean = true;
      component.isInitialLoading$.pipe(take(1)).subscribe((show: boolean) => {
        isInitialLoading = show;
      });
      tick();

      expect(isInitialLoading).toBe(false);
      flush();
    }));
  });

  describe("Navigation", () => {
    it("should navigate to make details", () => {
      const make: Make = { Make_ID: 440, Make_Name: "Audi" };

      component.onMakeClick(make);

      expect(router.navigate).toHaveBeenCalledWith(["/make", make.Make_ID], {
        queryParams: { name: make.Make_Name },
      });
    });
  });

  describe("Component Lifecycle", () => {
    it("should complete destroy subject on destroy", () => {
      const destroySpy = spyOn((component as any)["destroy$"], "next");
      const completeSpy = spyOn((component as any)["destroy$"], "complete");

      component.ngOnDestroy();

      expect(destroySpy).toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
    });
  });

  // Test individual functionality without complex state management
  describe("Basic Functionality", () => {
    it("should create", () => {
      expect(component).toBeTruthy();
    });

    it("should call clearSearch correctly", () => {
      component.clearSearch();
      expect(mockStore.dispatch).toHaveBeenCalledWith(clearSearchTerm());
    });

    it("should navigate on make click", () => {
      const make: Make = { Make_ID: 440, Make_Name: "Audi" };
      component.onMakeClick(make);
      expect(router.navigate).toHaveBeenCalledWith(["/make", make.Make_ID], {
        queryParams: { name: make.Make_Name },
      });
    });

    it("should dispatch search term on input", fakeAsync(() => {
      const mockEvent = { target: { value: "BMW" } } as unknown as Event;
      component.onSearchChange(mockEvent);
      tick(300); // debounce time
      expect(mockStore.dispatch).toHaveBeenCalledWith(
        setSearchTerm({ searchTerm: "BMW" })
      );
      flush();
    }));
  });
});
