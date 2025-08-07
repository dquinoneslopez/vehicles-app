import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { Subject, combineLatest } from "rxjs";
import {
  debounceTime,
  distinctUntilChanged,
  takeUntil,
  take,
  map,
  tap,
} from "rxjs/operators";
import { Make } from "../../models/make.model";
import { AppState } from "../../store/state/app.state";
import {
  loadMakes,
  setSearchTerm,
  clearSearchTerm,
} from "../../store/actions/vehicle.actions";
import {
  selectAllVehicles,
  selectLoading,
  selectSearchTerm,
  selectFilteredVehicles,
} from "../../store/selectors/vehicle.selectors";

@Component({
  selector: "app-home",
  standalone: false,
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit, OnDestroy {
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();
  private hasInitiallyLoaded = false;

  // Store selectors
  allMakes$ = this.store.select(selectAllVehicles);
  filteredMakes$ = this.store.select(selectFilteredVehicles);
  loading$ = this.store.select(selectLoading);
  searchTerm$ = this.store.select(selectSearchTerm);

  // Computed observables for loading states
  isInitialLoading$ = combineLatest([this.loading$, this.allMakes$]).pipe(
    map(([loading, makes]) => loading && makes.length === 0)
  );

  searchTerm = "";
  loading = false;

  constructor(private store: Store<AppState>, private router: Router) {
    // Watch all makes changes
    this.allMakes$
      .pipe(
        takeUntil(this.destroy$),
        tap((makes) => {
          if (makes.length > 0) {
            this.hasInitiallyLoaded = true;
          }
        })
      )
      .subscribe();

    // Watch search term changes from store
    this.searchTerm$
      .pipe(
        takeUntil(this.destroy$),
        tap((term) => {
          this.searchTerm = term;
        })
      )
      .subscribe();

    // Subscribe to loading state changes
    this.loading$
      .pipe(
        takeUntil(this.destroy$),
        tap((loading) => {
          this.loading = loading;
        })
      )
      .subscribe();

    // Setup search with debounce
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
        tap((searchTerm) => {
          this.store.dispatch(setSearchTerm({ searchTerm }));
        })
      )
      .subscribe();
  }

  ngOnInit(): void {
    // Load ALL data at once
    this.allMakes$
      .pipe(
        take(1),
        tap((makes: Make[]) => {
          if (makes.length === 0 && !this.hasInitiallyLoaded) {
            this.store.dispatch(loadMakes());
          }
        })
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearchChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const newSearchTerm = target.value;
    this.searchTerm = newSearchTerm;
    this.searchSubject.next(newSearchTerm);
  }

  clearSearch(): void {
    this.searchTerm = "";
    this.store.dispatch(clearSearchTerm());
  }

  trackByMake(index: number, make: Make): number {
    return make?.Make_ID || index;
  }

  onMakeClick(make: Make): void {
    this.router.navigate(["/make", make.Make_ID], {
      queryParams: {
        name: make.Make_Name,
      },
    });
  }
}
