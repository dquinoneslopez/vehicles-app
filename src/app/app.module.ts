import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";

// NgRx
import { StoreModule } from "@ngrx/store";
import { EffectsModule } from "@ngrx/effects";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";

// Components
import { AppComponent } from "./app.component";
import { HomeComponent } from "./pages/home/home.component";
import { MakeComponent } from "./pages/make/make.component";
import { VehicleListComponent } from "./components/vehicle-list/vehicle-list.component";
import { VehicleTypesCardComponent } from "./components/vehicle-types-card/vehicle-types-card.component";
import { VehicleModelsCardComponent } from "./components/vehicle-models-card/vehicle-models-card.component";

// Store
import { vehicleReducer } from "./store/reducers/vehicle.reducer";
import { VehicleEffects } from "./store/effects/vehicle.effects";

// Services
import { VehicleService } from "./services/vehicle.service";

// Routing
import { AppRoutingModule } from "./app.routes";

// Angular Material
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatCardModule } from "@angular/material/card";
import { MatListModule } from "@angular/material/list";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { MatProgressBarModule } from "@angular/material/progress-bar";

@NgModule({
  declarations: [
    AppComponent,
    VehicleListComponent,
    HomeComponent,
    MakeComponent,
    VehicleTypesCardComponent,
    VehicleModelsCardComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,

    // NgRx Store setup
    StoreModule.forRoot({ vehicles: vehicleReducer }),
    EffectsModule.forRoot([VehicleEffects]),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: false, // Set to false to enable debugging
      connectInZone: true,
    }),

    // Angular Material modules
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatListModule,
    MatProgressSpinnerModule,
    ScrollingModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,
  ],
  providers: [VehicleService],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor() {
    console.log("AppModule initialized - NgRx should be working");
  }
}
