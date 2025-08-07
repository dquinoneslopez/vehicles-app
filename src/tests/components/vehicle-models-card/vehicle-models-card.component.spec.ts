import { ComponentFixture, TestBed } from "@angular/core/testing";
import { BehaviorSubject } from "rxjs";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { MatCardModule } from "@angular/material/card";
import { MatListModule } from "@angular/material/list";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { ScrollingModule } from "@angular/cdk/scrolling";

import { VehicleModelsCardComponent } from "../../../app/components/vehicle-models-card/vehicle-models-card.component";
import { VehicleModel } from "../../../app/models/vehicle-model.model";

describe("VehicleModelsCardComponent", (): void => {
  let component: VehicleModelsCardComponent;
  let fixture: ComponentFixture<VehicleModelsCardComponent>;

  // Mock data
  const mockVehicleModels: VehicleModel[] = [
    { Model_ID: 1, Model_Name: "A4", Make_ID: 440, Make_Name: "Audi" },
    { Model_ID: 2, Model_Name: "A6", Make_ID: 440, Make_Name: "Audi" },
    { Model_ID: 3, Model_Name: "Q5", Make_ID: 440, Make_Name: "Audi" },
    { Model_ID: 4, Model_Name: "Q7", Make_ID: 440, Make_Name: "Audi" },
    { Model_ID: 5, Model_Name: "TT", Make_ID: 440, Make_Name: "Audi" },
  ];

  beforeEach(async (): Promise<void> => {
    await TestBed.configureTestingModule({
      declarations: [VehicleModelsCardComponent],
      imports: [
        NoopAnimationsModule,
        MatCardModule,
        MatListModule,
        MatIconModule,
        MatProgressSpinnerModule,
        ScrollingModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(VehicleModelsCardComponent);
    component = fixture.componentInstance;
  });

  afterEach((): void => {
    fixture.destroy();
  });

  describe("Component Initialization", (): void => {
    it("should create", (): void => {
      expect(component).toBeTruthy();
    });

    it("should initialize with null inputs", (): void => {
      expect(component.vehicleModels$).toBeNull();
      expect(component.loading$).toBeNull();
    });
  });

  describe("Input Properties", (): void => {
    it("should accept vehicleModels$ observable input", (): void => {
      const vehicleModels$ = new BehaviorSubject<VehicleModel[]>(
        mockVehicleModels
      );
      component.vehicleModels$ = vehicleModels$;

      expect(component.vehicleModels$).toBe(vehicleModels$);
    });

    it("should accept loading$ observable input", (): void => {
      const loading$ = new BehaviorSubject<boolean>(true);
      component.loading$ = loading$;

      expect(component.loading$).toBe(loading$);
    });
  });

  describe("Template Rendering", (): void => {
    beforeEach((): void => {
      component.vehicleModels$ = new BehaviorSubject<VehicleModel[]>([]);
      component.loading$ = new BehaviorSubject<boolean>(false);
      fixture.detectChanges();
    });

    it("should display card title", (): void => {
      const cardTitle =
        fixture.debugElement.nativeElement.querySelector(".nested-card-title");
      expect(cardTitle.textContent.trim()).toBe("Vehicle Models");
    });

    it("should display item counter with correct count", (): void => {
      (component.vehicleModels$ as BehaviorSubject<VehicleModel[]>).next(
        mockVehicleModels
      );
      fixture.detectChanges();

      const itemCounter =
        fixture.debugElement.nativeElement.querySelector(".item-counter");
      expect(itemCounter.textContent.trim()).toBe("(5)");
    });

    it("should display zero count when no vehicle models", (): void => {
      const itemCounter =
        fixture.debugElement.nativeElement.querySelector(".item-counter");
      expect(itemCounter.textContent.trim()).toBe("(0)");
    });
  });

  describe("Loading State", (): void => {
    beforeEach((): void => {
      component.vehicleModels$ = new BehaviorSubject<VehicleModel[]>([]);
    });

    it("should show loading spinner when loading is true", (): void => {
      component.loading$ = new BehaviorSubject<boolean>(true);
      fixture.detectChanges();

      const loadingContainer =
        fixture.debugElement.nativeElement.querySelector(".loading-container");
      const spinner =
        fixture.debugElement.nativeElement.querySelector("mat-spinner");
      const loadingText = loadingContainer.textContent;

      expect(loadingContainer).toBeTruthy();
      expect(spinner).toBeTruthy();
      expect(loadingText).toContain("Loading vehicle models...");
    });

    it("should not show loading spinner when loading is false", (): void => {
      component.loading$ = new BehaviorSubject<boolean>(false);
      fixture.detectChanges();

      const spinner =
        fixture.debugElement.nativeElement.querySelector("mat-spinner");
      expect(spinner).toBeFalsy();
    });
  });

  describe("Empty State", (): void => {
    beforeEach((): void => {
      component.loading$ = new BehaviorSubject<boolean>(false);
    });

    it("should show no results message when vehicle models array is empty", (): void => {
      component.vehicleModels$ = new BehaviorSubject<VehicleModel[]>([]);
      fixture.detectChanges();

      const noResults =
        fixture.debugElement.nativeElement.querySelector(".no-results");
      const infoIcon = noResults.querySelector("mat-icon");
      const message = noResults.textContent;

      expect(noResults).toBeTruthy();
      expect(infoIcon.textContent.trim()).toBe("info");
      expect(message).toContain("No vehicle models found for this brand.");
    });

    it("should not show no results when vehicle models exist", (): void => {
      component.vehicleModels$ = new BehaviorSubject<VehicleModel[]>(
        mockVehicleModels
      );
      fixture.detectChanges();

      const noResults =
        fixture.debugElement.nativeElement.querySelector(".no-results");
      expect(noResults).toBeFalsy();
    });
  });

  describe("Virtual Scrolling", (): void => {
    beforeEach((): void => {
      component.loading$ = new BehaviorSubject<boolean>(false);
      component.vehicleModels$ = new BehaviorSubject<VehicleModel[]>(
        mockVehicleModels
      );
      fixture.detectChanges();
    });

    it("should display virtual scroll viewport", (): void => {
      const viewport = fixture.debugElement.nativeElement.querySelector(
        "cdk-virtual-scroll-viewport"
      );
      expect(viewport).toBeTruthy();
      expect(viewport.getAttribute("itemSize")).toBe("56");
      expect(viewport.classList.contains("viewport")).toBe(true);
    });

    it("should display vehicle models list inside virtual scroll", (): void => {
      const matList =
        fixture.debugElement.nativeElement.querySelector("mat-list");
      const viewport = fixture.debugElement.nativeElement.querySelector(
        "cdk-virtual-scroll-viewport"
      );

      expect(matList).toBeTruthy();
      expect(viewport.contains(matList)).toBe(true);
    });

    it("should use cdkVirtualFor directive", (): void => {
      const listItems =
        fixture.debugElement.nativeElement.querySelectorAll("mat-list-item");
      expect(listItems.length).toBeGreaterThan(0);
    });
  });

  describe("Vehicle Models List", (): void => {
    beforeEach((): void => {
      component.loading$ = new BehaviorSubject<boolean>(false);
      component.vehicleModels$ = new BehaviorSubject<VehicleModel[]>(
        mockVehicleModels
      );
      fixture.detectChanges();
    });

    it("should display correct vehicle model information", (): void => {
      const listItems =
        fixture.debugElement.nativeElement.querySelectorAll("mat-list-item");

      if (listItems.length > 0) {
        const firstItem = listItems[0];
        const icon = firstItem.querySelector("mat-icon");
        const title = firstItem.querySelector("[matListItemTitle]");
        const line = firstItem.querySelector("[matListItemLine]");

        expect(icon.textContent.trim()).toBe("directions_car");
        expect(title.textContent.trim()).toBe("A4");
        expect(line.textContent.trim()).toBe("ID: 1");
      }
    });

    it("should apply correct CSS classes to list items", (): void => {
      const listItems =
        fixture.debugElement.nativeElement.querySelectorAll("mat-list-item");

      listItems.forEach((item: HTMLElement) => {
        expect(item.classList.contains("vehicle-item")).toBe(true);
      });
    });
  });

  describe("TrackBy Function", (): void => {
    it("should return Model_ID when available", (): void => {
      const vehicleModel: VehicleModel = {
        Model_ID: 10,
        Model_Name: "Test Model",
        Make_ID: 440,
        Make_Name: "Audi",
      };
      const result = component.trackByVehicleModel(0, vehicleModel);
      expect(result).toBe(10);
    });

    it("should return index when Model_ID is not available", (): void => {
      const vehicleModel: VehicleModel = {
        Model_ID: 0,
        Model_Name: "Test Model",
        Make_ID: 440,
        Make_Name: "Audi",
      };
      const result = component.trackByVehicleModel(7, vehicleModel);
      expect(result).toBe(7);
    });

    it("should handle null vehicle model gracefully", (): void => {
      const result = component.trackByVehicleModel(3, null as any);
      expect(result).toBe(3);
    });

    it("should handle undefined vehicle model gracefully", (): void => {
      const result = component.trackByVehicleModel(5, undefined as any);
      expect(result).toBe(5);
    });
  });

  describe("State Changes", (): void => {
    it("should update display when vehicle models change", (): void => {
      const vehicleModels$ = new BehaviorSubject<VehicleModel[]>([]);
      component.vehicleModels$ = vehicleModels$;
      component.loading$ = new BehaviorSubject<boolean>(false);
      fixture.detectChanges();

      // Check counter shows zero
      let itemCounter =
        fixture.debugElement.nativeElement.querySelector(".item-counter");
      expect(itemCounter.textContent.trim()).toBe("(0)");

      // Add vehicle models
      vehicleModels$.next(mockVehicleModels);
      fixture.detectChanges();

      // Check counter updated
      itemCounter =
        fixture.debugElement.nativeElement.querySelector(".item-counter");
      expect(itemCounter.textContent.trim()).toBe("(5)");
    });

    it("should update display when loading state changes", (): void => {
      const loading$ = new BehaviorSubject<boolean>(false);
      component.vehicleModels$ = new BehaviorSubject<VehicleModel[]>([]);
      component.loading$ = loading$;
      fixture.detectChanges();

      // Initially not loading
      let spinner =
        fixture.debugElement.nativeElement.querySelector("mat-spinner");
      expect(spinner).toBeFalsy();

      // Start loading
      loading$.next(true);
      fixture.detectChanges();

      // Should show spinner
      spinner = fixture.debugElement.nativeElement.querySelector("mat-spinner");
      expect(spinner).toBeTruthy();
    });
  });

  describe("Error Handling", (): void => {
    it("should handle null vehicleModels$ input gracefully", (): void => {
      component.vehicleModels$ = null;
      component.loading$ = new BehaviorSubject<boolean>(false);

      expect((): void => {
        fixture.detectChanges();
      }).not.toThrow();

      const itemCounter =
        fixture.debugElement.nativeElement.querySelector(".item-counter");
      expect(itemCounter.textContent.trim()).toBe("(0)");
    });

    it("should handle null loading$ input gracefully", (): void => {
      component.vehicleModels$ = new BehaviorSubject<VehicleModel[]>(
        mockVehicleModels
      );
      component.loading$ = null;

      expect((): void => {
        fixture.detectChanges();
      }).not.toThrow();
    });
  });

  describe("Virtual Scrolling Performance", (): void => {
    it("should handle large datasets efficiently", (): void => {
      const largeDataset: VehicleModel[] = Array.from(
        { length: 1000 },
        (_, i) => ({
          Model_ID: i + 1,
          Model_Name: `Model ${i + 1}`,
          Make_ID: 440,
          Make_Name: "Test Brand",
        })
      );

      component.vehicleModels$ = new BehaviorSubject<VehicleModel[]>(
        largeDataset
      );
      component.loading$ = new BehaviorSubject<boolean>(false);

      expect((): void => {
        fixture.detectChanges();
      }).not.toThrow();

      const itemCounter =
        fixture.debugElement.nativeElement.querySelector(".item-counter");
      expect(itemCounter.textContent.trim()).toBe("(1000)");
    });
  });
});
