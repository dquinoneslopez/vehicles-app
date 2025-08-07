import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
  flush,
} from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { provideMockStore, MockStore } from "@ngrx/store/testing";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatToolbarModule } from "@angular/material/toolbar";
import { Component, Input } from "@angular/core";
import { Observable, BehaviorSubject, of } from "rxjs";

import { MakeComponent } from "../../../app/pages/make/make.component";
import { VehicleType } from "../../../app/models/vehicle-type.model";
import { VehicleModel } from "../../../app/models/vehicle-model.model";

// Mock child components
@Component({
  selector: "app-vehicle-types-card",
  template: "<div>Mock Vehicle Types Card</div>",
})
class MockVehicleTypesCardComponent {
  @Input() vehicleTypes$: Observable<VehicleType[]> | null = null;
  @Input() loading$: Observable<boolean> | null = null;
}

@Component({
  selector: "app-vehicle-models-card",
  template: "<div>Mock Vehicle Models Card</div>",
})
class MockVehicleModelsCardComponent {
  @Input() vehicleModels$: Observable<VehicleModel[]> | null = null;
  @Input() loading$: Observable<boolean> | null = null;
}

describe("MakeComponent", () => {
  let component: MakeComponent;
  let fixture: ComponentFixture<MakeComponent>;
  let mockStore: MockStore;
  let mockActivatedRoute: any;

  const mockVehicleTypes: VehicleType[] = [
    { VehicleTypeId: 1, VehicleTypeName: "Passenger Car" },
    { VehicleTypeId: 2, VehicleTypeName: "Truck" },
  ];

  const mockVehicleModels: VehicleModel[] = [
    { Model_ID: 1, Model_Name: "A4", Make_ID: 440, Make_Name: "Audi" },
    { Model_ID: 2, Model_Name: "A6", Make_ID: 440, Make_Name: "Audi" },
  ];

  const initialState = {
    vehicles: {
      vehicles: [],
      vehicleTypes: mockVehicleTypes,
      vehicleModels: mockVehicleModels,
      vehicleTypesForMake: { 440: mockVehicleTypes },
      loadedVehicleTypesMakeIds: new Set([440]),
      loadedVehicleModelsMakeIds: new Set([440]),
      currentMakeId: 440,
      loading: false,
      error: null,
      searchTerm: "",
    },
  };

  beforeEach(async () => {
    // Create a complete mock for ActivatedRoute
    mockActivatedRoute = {
      paramMap: of({
        get: (key: string) => (key === "id" ? "440" : null),
        has: (key: string) => key === "id",
        getAll: (key: string) => [key === "id" ? "440" : null],
        keys: ["id"],
      }),
      queryParamMap: of({
        get: (key: string) => (key === "name" ? "Audi" : null),
        has: (key: string) => key === "name",
        getAll: (key: string) => [key === "name" ? "Audi" : null],
        keys: ["name"],
      }),
      params: of({ id: "440" }),
      queryParams: of({ name: "Audi" }),
      snapshot: {
        paramMap: {
          get: (key: string) => (key === "id" ? "440" : null),
        },
        queryParamMap: {
          get: (key: string) => (key === "name" ? "Audi" : null),
        },
        params: { id: "440" },
        queryParams: { name: "Audi" },
      },
    };

    await TestBed.configureTestingModule({
      declarations: [
        MakeComponent,
        MockVehicleTypesCardComponent,
        MockVehicleModelsCardComponent,
      ],
      imports: [
        NoopAnimationsModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatToolbarModule,
      ],
      providers: [
        provideMockStore({ initialState }),
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MakeComponent);
    component = fixture.componentInstance;
    mockStore = TestBed.inject(MockStore);

    mockStore.overrideSelector("selectVehicleTypesForMake", mockVehicleTypes);
    mockStore.overrideSelector("selectVehicleModelsForMake", mockVehicleModels);
    mockStore.overrideSelector("selectLoading", false);

    spyOn(mockStore, "dispatch").and.callThrough();
  });

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
    mockStore?.resetSelectors();
    // Remove flush() from afterEach - it's causing the error
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should extract makeId from route params", fakeAsync(() => {
    component.ngOnInit();
    tick();

    expect(component.makeId).toBe(440);
    flush(); // This is fine inside fakeAsync
  }));

  it("should extract make name from query params", fakeAsync(() => {
    component.ngOnInit();
    tick();

    let makeName: string | undefined;
    component.makeName$?.subscribe((name) => (makeName = name));
    expect(makeName).toBe("Audi");
    flush(); // This is fine inside fakeAsync
  }));
});
