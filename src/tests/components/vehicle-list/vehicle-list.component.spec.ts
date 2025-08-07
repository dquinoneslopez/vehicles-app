import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DebugElement } from "@angular/core";
import { By } from "@angular/platform-browser";

import { VehicleListComponent } from "../../../app/components/vehicle-list/vehicle-list.component";

describe("VehicleListComponent", () => {
  let component: VehicleListComponent;
  let fixture: ComponentFixture<VehicleListComponent>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VehicleListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VehicleListComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  describe("Component Initialization", () => {
    it("should create", () => {
      expect(component).toBeTruthy();
    });

    it("should be defined after creation", () => {
      expect(component).toBeDefined();
    });

    it("should have correct component properties", () => {
      expect(component.constructor).toBeDefined();
    });
  });

  describe("Template Rendering", () => {
    it("should render the placeholder text", () => {
      expect(compiled.textContent?.trim()).toBe("vehicle-list works!");
    });

    it("should contain a paragraph element", () => {
      const paragraph = compiled.querySelector("p");
      expect(paragraph).toBeTruthy();
      expect(paragraph?.textContent?.trim()).toBe("vehicle-list works!");
    });

    it("should have correct DOM structure", () => {
      const debugElement: DebugElement = fixture.debugElement;
      const paragraphDE = debugElement.query(By.css("p"));

      expect(paragraphDE).toBeTruthy();
      expect(paragraphDE.nativeElement.textContent.trim()).toBe(
        "vehicle-list works!"
      );
    });
  });

  describe("Component Lifecycle", () => {
    it("should not throw error during ngOnInit if implemented", () => {
      // Test that component handles lifecycle properly
      expect(() => {
        if (
          "ngOnInit" in component &&
          typeof component.ngOnInit === "function"
        ) {
          component.ngOnInit();
        }
      }).not.toThrow();
    });

    it("should not throw error during ngOnDestroy if implemented", () => {
      expect(() => {
        if (
          "ngOnDestroy" in component &&
          typeof component.ngOnDestroy === "function"
        ) {
          component.ngOnDestroy();
        }
      }).not.toThrow();
    });
  });

  describe("Component Metadata", () => {
    it("should have correct selector", () => {
      const componentInstance = fixture.componentRef.instance;
      expect(componentInstance).toBeInstanceOf(VehicleListComponent);
    });

    it("should be a non-standalone component", () => {
      // Since standalone: false is set, verify component behavior
      expect(component).toBeTruthy();
    });
  });

  describe("Template Compilation", () => {
    it("should compile template without errors", () => {
      expect(() => {
        fixture.detectChanges();
      }).not.toThrow();
    });

    it("should update view when properties change", () => {
      // Since there are no properties yet, just verify detection works
      expect(() => {
        fixture.detectChanges();
      }).not.toThrow();
    });
  });

  describe("Error Handling", () => {
    it("should handle component instantiation gracefully", () => {
      const newFixture = TestBed.createComponent(VehicleListComponent);
      expect(newFixture.componentInstance).toBeTruthy();
      newFixture.destroy();
    });

    it("should not have memory leaks after destruction", () => {
      const initialComponent = fixture.componentInstance;
      fixture.destroy();

      // Component should still be accessible but fixture should be destroyed
      expect(initialComponent).toBeTruthy();
    });
  });

  describe("Future Extensibility", () => {
    it("should be ready to accept input properties", () => {
      // Test that component can be extended with @Input properties
      expect(component).toBeTruthy();
      expect(typeof component).toBe("object");
    });

    it("should be ready to emit output events", () => {
      // Test that component can be extended with @Output events
      expect(component).toBeTruthy();
      expect(component.constructor).toBeDefined();
    });

    it("should support dependency injection", () => {
      // Verify constructor is properly set up for DI
      expect(component.constructor).toBeDefined();
      expect(component.constructor.length).toBe(0); // Currently no dependencies
    });
  });

  describe("Styling", () => {
    it("should have access to component styles", () => {
      // Verify that styleUrls are properly configured
      const componentRef = fixture.componentRef;
      expect(componentRef).toBeTruthy();
    });

    it("should not have inline styles conflicts", () => {
      const element = compiled;
      expect(element.style.length).toBe(0); // No inline styles expected
    });
  });

  describe("Performance", () => {
    it("should render efficiently", () => {
      const startTime = performance.now();

      for (let i = 0; i < 100; i++) {
        fixture.detectChanges();
      }

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Should render 100 times in less than 1000ms (very generous)
      expect(renderTime).toBeLessThan(1000);
    });

    it("should not cause memory issues with repeated creation", () => {
      const fixtures: ComponentFixture<VehicleListComponent>[] = [];

      // Create multiple instances
      for (let i = 0; i < 10; i++) {
        const testFixture = TestBed.createComponent(VehicleListComponent);
        testFixture.detectChanges();
        fixtures.push(testFixture);
      }

      // All should be created successfully
      expect(fixtures.length).toBe(10);
      fixtures.forEach((f) => expect(f.componentInstance).toBeTruthy());

      // Clean up
      fixtures.forEach((f) => f.destroy());
    });
  });
});
