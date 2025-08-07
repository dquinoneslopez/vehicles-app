import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./pages/home/home.component";
import { MakeComponent } from "./pages/make/make.component";

export const routes: Routes = [
  {
    path: "home",
    component: HomeComponent,
    title: "Home - Vehicles App",
  },
  {
    path: "make/:id",
    component: MakeComponent,
    title: "Make Details - Vehicles App",
  },
  {
    path: "**",
    redirectTo: "home",
    pathMatch: "full",
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      enableTracing: false,
      useHash: false,
      scrollPositionRestoration: "top",
      onSameUrlNavigation: "reload",
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
