import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from "@angular/core/testing";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { provideMockStore, MockStore } from "@ngrx/store/testing";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { FormsModule } from "@angular/forms";
import { DebugElement } from "@angular/core";
import { By } from "@angular/platform-browser";

import { HomeComponent } from "../../../app/pages/home/home.component";
import { Make } from "../../../app/models/make.model";
import { AppState } from "../../../app/store/app.state";
import {
  selectAllVehicles,
  selectFilteredVehicles,
  selectLoading,
  selectSearchTerm,
} from "../../../app/store/selectors/vehicle.selectors";

describe("HomeComponent Integration Tests", () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let store: MockStore<AppState>;
  let mockRouter: jasmine.SpyObj<Router>;

  const mockBrands: Make[] = [
    { Make_ID: 1, Make_Name: "Audi" },
    { Make_ID: 2, Make_Name: "BMW" },
    { Make_ID: 3, Make_Name: "Ford" },
    { Make_ID: 4, Make_Name: "Toyota" },
  ];

  const initialState: Partial<AppState> = {
    vehicles: {
      vehicles: [],
      vehicleTypes: [],
      loading: false,
      error: null,
      searchTerm: "",
    },
  };

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj("Router", ["navigate"]);

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
        provideMockStore({ initialState }),
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store) as MockStore<AppState>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  describe("Full Component Flow", () => {
    it("should load and display brands end-to-end", fakeAsync(() => {
      // Initial state - loading
      store.overrideSelector(selectLoading, true);
      store.overrideSelector(selectAllVehicles, []);
      store.refreshState();

      fixture.detectChanges();
      tick();

      // Should show loading spinner
      const spinner = fixture.debugElement.query(By.css("mat-spinner"));
      expect(spinner).toBeTruthy();

      // Data loaded
      store.overrideSelector(selectLoading, false);
      store.overrideSelector(selectAllVehicles, mockBrands);
      store.overrideSelector(selectFilteredVehicles, mockBrands);
      store.refreshState();

      fixture.detectChanges();
      tick();

      // Should show brands list
      const brandItems = fixture.debugElement.queryAll(By.css(".brand-item"));
      expect(brandItems.length).toBe(4);

      // Should show results info
      const resultsInfo = fixture.debugElement.query(By.css(".results-info"));
      expect(resultsInfo.nativeElement.textContent).toContain("4 brands");
    }));

    it("should handle search flow end-to-end", fakeAsync(() => {
      // Setup initial data
      store.overrideSelector(selectAllVehicles, mockBrands);
      store.overrideSelector(selectFilteredVehicles, mockBrands);
      store.overrideSelector(selectLoading, false);
      store.overrideSelector(selectSearchTerm, "");
      store.refreshState();

      fixture.detectChanges();
      tick();

      // Perform search
      const searchInput: HTMLInputElement = fixture.debugElement.query(
        By.css("input[matInput]")
      ).nativeElement;

      searchInput.value = "Ford";
      searchInput.dispatchEvent(new Event("input"));

      tick(300); // Wait for debounce

      // Simulate filtered results
      const filteredBrands = mockBrands.filter((b) =>
        b.Make_Name.toLowerCase().includes("ford")
      );

      store.overrideSelector(selectFilteredVehicles, filteredBrands);
      store.overrideSelector(selectSearchTerm, "Ford");
      store.refreshState();

      fixture.detectChanges();
      tick();

      // Should show filtered results
      const resultsInfo = fixture.debugElement.query(By.css(".results-info"));
      expect(resultsInfo.nativeElement.textContent).toContain(
        '1 of 4 brands for "Ford"'
      );

      const brandItems = fixture.debugElement.queryAll(By.css(".brand-item"));
      expect(brandItems.length).toBe(1);
    }));

    it("should handle no results state", fakeAsync(() => {
      // Setup search with no results
      store.overrideSelector(selectAllVehicles, mockBrands);
      store.overrideSelector(selectFilteredVehicles, []);
      store.overrideSelector(selectSearchTerm, "NonexistentBrand");
      store.overrideSelector(selectLoading, false);
      store.refreshState();

      fixture.detectChanges();
      tick();

      // Should show no results message
      const noResults = fixture.debugElement.query(By.css(".no-results"));
      expect(noResults).toBeTruthy();
      expect(noResults.nativeElement.textContent).toContain("No brands found");
      expect(noResults.nativeElement.textContent).toContain("NonexistentBrand");
    }));

    it("should handle brand click navigation", fakeAsync(() => {
      // Setup data
      store.overrideSelector(selectAllVehicles, mockBrands);
      store.overrideSelector(selectFilteredVehicles, mockBrands);
      store.overrideSelector(selectLoading, false);
      store.refreshState();

      fixture.detectChanges();
      tick();

      // Click on first brand
      const firstBrandItem = fixture.debugElement.query(By.css(".brand-item"));
      firstBrandItem.nativeElement.click();

      expect(mockRouter.navigate).toHaveBeenCalledWith(["/brand", 1], {
        queryParams: { name: "Audi" },
      });
    }));

    it("should clear search functionality", fakeAsync(() => {
      // Setup search state
      store.overrideSelector(selectSearchTerm, "Ford");
      store.overrideSelector(selectAllVehicles, mockBrands);
      store.overrideSelector(selectFilteredVehicles, [mockBrands[2]]); // Ford only
      store.refreshState();

      fixture.detectChanges();
      tick();

      // Should show clear button
      const clearButton = fixture.debugElement.query(
        By.css("button[matSuffix]")
      );
      expect(clearButton).toBeTruthy();

      // Click clear button
      clearButton.nativeElement.click();

      expect(component.searchTerm).toBe("");
    }));
  });

  describe("Accessibility and UX", () => {
    it("should have proper ARIA labels", fakeAsync(() => {
      fixture.detectChanges();
      tick();

      const searchInput = fixture.debugElement.query(By.css("input[matInput]"));
      expect(searchInput.nativeElement.placeholder).toBe("Type to search...");

      // Check if clear button appears when there's a search term
      store.overrideSelector(selectSearchTerm, "Ford");
      store.refreshState();
      fixture.detectChanges();
      tick();

      const clearButtonWithSearch = fixture.debugElement.query(
        By.css('button[aria-label="Clear search"]')
      );
      expect(clearButtonWithSearch).toBeTruthy();
    }));

    it("should disable search input during loading", fakeAsync(() => {
      store.overrideSelector(selectLoading, true);
      store.refreshState();

      fixture.detectChanges();
      tick();

      const searchInput: HTMLInputElement = fixture.debugElement.query(
        By.css("input[matInput]")
      ).nativeElement;

      expect(searchInput.disabled).toBe(true);
    }));
  });

  describe("Performance Considerations", () => {
    it("should use virtual scrolling for large datasets", fakeAsync(() => {
      // Create large dataset
      const largeBrandsList: Make[] = Array.from({ length: 1000 }, (_, i) => ({
        Make_ID: i + 1,
        Make_Name: `Brand ${i + 1}`,
      }));

      store.overrideSelector(selectAllVehicles, largeBrandsList);
      store.overrideSelector(selectFilteredVehicles, largeBrandsList);
      store.overrideSelector(selectLoading, false);
      store.refreshState();

      fixture.detectChanges();
      tick();

      // Should use virtual scrolling viewport
      const viewport = fixture.debugElement.query(
        By.css("cdk-virtual-scroll-viewport")
      );
      expect(viewport).toBeTruthy();

      // Should show total count
      const resultsInfo = fixture.debugElement.query(By.css(".results-info"));
      expect(resultsInfo.nativeElement.textContent).toContain("1000 brands");
    }));
  });

  describe("Component Properties", () => {
    it("should not have isLoadingMore$ observable", () => {
      expect(component.hasOwnProperty("isLoadingMore$")).toBe(false);
    });

    it("should have all required observables except isLoadingMore$", () => {
      expect(component.allBrands$).toBeDefined();
      expect(component.filteredBrands$).toBeDefined();
      expect(component.loading$).toBeDefined();
      expect(component.searchTerm$).toBeDefined();
      expect(component.isInitialLoading$).toBeDefined();
    });
  });
});
