import { ComponentFixture, TestBed } from "@angular/core/testing";
import { BehaviorSubject } from "rxjs";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { MatCardModule } from "@angular/material/card";
import { MatListModule } from "@angular/material/list";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

import { VehicleTypesCardComponent } from "../../../app/components/vehicle-types-card/vehicle-types-card.component";
import { VehicleType } from "../../../app/models/vehicle-type.model";

describe("VehicleTypesCardComponent", (): void => {
  let component: VehicleTypesCardComponent;
  let fixture: ComponentFixture<VehicleTypesCardComponent>;

  // Mock data
  const mockVehicleTypes: VehicleType[] = [
    { VehicleTypeId: 1, VehicleTypeName: "Passenger Car" },
    { VehicleTypeId: 2, VehicleTypeName: "Truck" },
    { VehicleTypeId: 3, VehicleTypeName: "SUV" },
  ];

  beforeEach(async (): Promise<void> => {
    await TestBed.configureTestingModule({
      declarations: [VehicleTypesCardComponent],
      imports: [
        NoopAnimationsModule,
        MatCardModule,
        MatListModule,
        MatIconModule,
        MatProgressSpinnerModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(VehicleTypesCardComponent);
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
      expect(component.vehicleTypes$).toBeNull();
      expect(component.loading$).toBeNull();
    });
  });

  describe("Input Properties", (): void => {
    it("should accept vehicleTypes$ observable input", (): void => {
      const vehicleTypes$ = new BehaviorSubject<VehicleType[]>(
        mockVehicleTypes
      );
      component.vehicleTypes$ = vehicleTypes$;

      expect(component.vehicleTypes$).toBe(vehicleTypes$);
    });

    it("should accept loading$ observable input", (): void => {
      const loading$ = new BehaviorSubject<boolean>(true);
      component.loading$ = loading$;

      expect(component.loading$).toBe(loading$);
    });
  });

  describe("Template Rendering", (): void => {
    beforeEach((): void => {
      component.vehicleTypes$ = new BehaviorSubject<VehicleType[]>([]);
      component.loading$ = new BehaviorSubject<boolean>(false);
      fixture.detectChanges();
    });

    it("should display card title", (): void => {
      const cardTitle =
        fixture.debugElement.nativeElement.querySelector(".nested-card-title");
      expect(cardTitle.textContent.trim()).toBe("Vehicle Types");
    });

    it("should display item counter with correct count", (): void => {
      (component.vehicleTypes$ as BehaviorSubject<VehicleType[]>).next(
        mockVehicleTypes
      );
      fixture.detectChanges();

      const itemCounter =
        fixture.debugElement.nativeElement.querySelector(".item-counter");
      expect(itemCounter.textContent.trim()).toBe("(3)");
    });

    it("should display zero count when no vehicle types", (): void => {
      const itemCounter =
        fixture.debugElement.nativeElement.querySelector(".item-counter");
      expect(itemCounter.textContent.trim()).toBe("(0)");
    });
  });

  describe("Loading State", (): void => {
    beforeEach((): void => {
      component.vehicleTypes$ = new BehaviorSubject<VehicleType[]>([]);
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
      expect(loadingText).toContain("Loading vehicle types...");
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

    it("should show no results message when vehicle types array is empty", (): void => {
      component.vehicleTypes$ = new BehaviorSubject<VehicleType[]>([]);
      fixture.detectChanges();

      const noResults =
        fixture.debugElement.nativeElement.querySelector(".no-results");
      const infoIcon = noResults.querySelector("mat-icon");
      const message = noResults.textContent;

      expect(noResults).toBeTruthy();
      expect(infoIcon.textContent.trim()).toBe("info");
      expect(message).toContain("No vehicle types found for this make.");
    });

    it("should not show no results when vehicle types exist", (): void => {
      component.vehicleTypes$ = new BehaviorSubject<VehicleType[]>(
        mockVehicleTypes
      );
      fixture.detectChanges();

      const noResults =
        fixture.debugElement.nativeElement.querySelector(".no-results");
      expect(noResults).toBeFalsy();
    });
  });

  describe("Vehicle Types List", (): void => {
    beforeEach((): void => {
      component.loading$ = new BehaviorSubject<boolean>(false);
      component.vehicleTypes$ = new BehaviorSubject<VehicleType[]>(
        mockVehicleTypes
      );
      fixture.detectChanges();
    });

    it("should display vehicle types list when data is available", (): void => {
      const matList =
        fixture.debugElement.nativeElement.querySelector("mat-list");
      const listItems =
        fixture.debugElement.nativeElement.querySelectorAll("mat-list-item");

      expect(matList).toBeTruthy();
      expect(listItems.length).toBe(3);
    });

    it("should display correct vehicle type information", (): void => {
      const listItems =
        fixture.debugElement.nativeElement.querySelectorAll("mat-list-item");

      // Check first item
      const firstItem = listItems[0];
      const icon = firstItem.querySelector("mat-icon");
      const title = firstItem.querySelector("[matListItemTitle]");
      const line = firstItem.querySelector("[matListItemLine]");

      expect(icon.textContent.trim()).toBe("category");
      expect(title.textContent.trim()).toBe("Passenger Car");
      expect(line.textContent.trim()).toBe("ID: 1");
    });

    it("should apply correct CSS classes to list items", (): void => {
      const listItems =
        fixture.debugElement.nativeElement.querySelectorAll("mat-list-item");

      listItems.forEach((item: HTMLElement) => {
        expect(item.classList.contains("vehicle-item")).toBe(true);
      });
    });

    it("should display all vehicle types", (): void => {
      const titles = Array.from(
        fixture.debugElement.nativeElement.querySelectorAll(
          "[matListItemTitle]"
        )
      ).map((el: any) => el.textContent.trim());

      expect(titles).toEqual(["Passenger Car", "Truck", "SUV"]);
    });

    it("should display all vehicle type IDs", (): void => {
      const lines = Array.from(
        fixture.debugElement.nativeElement.querySelectorAll("[matListItemLine]")
      ).map((el: any) => el.textContent.trim());

      expect(lines).toEqual(["ID: 1", "ID: 2", "ID: 3"]);
    });
  });

  describe("TrackBy Function", (): void => {
    it("should return VehicleTypeId when available", (): void => {
      const vehicleType: VehicleType = {
        VehicleTypeId: 5,
        VehicleTypeName: "Test",
      };
      const result = component.trackByVehicleType(0, vehicleType);
      expect(result).toBe(5);
    });

    it("should return index when VehicleTypeId is not available", (): void => {
      const vehicleType: VehicleType = {
        VehicleTypeId: 0,
        VehicleTypeName: "Test",
      };
      const result = component.trackByVehicleType(3, vehicleType);
      expect(result).toBe(3);
    });

    it("should handle null vehicle type gracefully", (): void => {
      const result = component.trackByVehicleType(2, null as any);
      expect(result).toBe(2);
    });

    it("should handle undefined vehicle type gracefully", (): void => {
      const result = component.trackByVehicleType(4, undefined as any);
      expect(result).toBe(4);
    });
  });

  describe("State Changes", (): void => {
    it("should update display when vehicle types change", (): void => {
      const vehicleTypes$ = new BehaviorSubject<VehicleType[]>([]);
      component.vehicleTypes$ = vehicleTypes$;
      component.loading$ = new BehaviorSubject<boolean>(false);
      fixture.detectChanges();

      // Initially no items
      let listItems =
        fixture.debugElement.nativeElement.querySelectorAll("mat-list-item");
      expect(listItems.length).toBe(0);

      // Add vehicle types
      vehicleTypes$.next(mockVehicleTypes);
      fixture.detectChanges();

      // Now should have items
      listItems =
        fixture.debugElement.nativeElement.querySelectorAll("mat-list-item");
      expect(listItems.length).toBe(3);

      // Check counter updated
      const itemCounter =
        fixture.debugElement.nativeElement.querySelector(".item-counter");
      expect(itemCounter.textContent.trim()).toBe("(3)");
    });

    it("should update display when loading state changes", (): void => {
      const loading$ = new BehaviorSubject<boolean>(false);
      component.vehicleTypes$ = new BehaviorSubject<VehicleType[]>([]);
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
    it("should handle null vehicleTypes$ input gracefully", (): void => {
      component.vehicleTypes$ = null;
      component.loading$ = new BehaviorSubject<boolean>(false);

      expect((): void => {
        fixture.detectChanges();
      }).not.toThrow();

      const itemCounter =
        fixture.debugElement.nativeElement.querySelector(".item-counter");
      expect(itemCounter.textContent.trim()).toBe("(0)");
    });

    it("should handle null loading$ input gracefully", (): void => {
      component.vehicleTypes$ = new BehaviorSubject<VehicleType[]>(
        mockVehicleTypes
      );
      component.loading$ = null;

      expect((): void => {
        fixture.detectChanges();
      }).not.toThrow();
    });
  });
});
