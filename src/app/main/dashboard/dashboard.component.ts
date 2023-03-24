import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {RouterLinkWithHref} from '@angular/router';
import {
  debounceTime,
  delay,
  distinctUntilChanged,
  filter,
  finalize,
  map,
  shareReplay,
  switchMap, tap,
} from 'rxjs';

import {heroesFn, searchFn} from '../api.heroes';
import {HeroSearchComponent} from '../hero-search/hero-search.component';
import {Hero} from '../interfaces/hero.interface';
import {LoaderService} from '../services/loader.service';
import {SnackbarService} from '../services/snackbar.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLinkWithHref,
    ReactiveFormsModule,
    HeroSearchComponent,
    MatProgressSpinnerModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  readonly _heroesFn = heroesFn();
  readonly _searchFn = searchFn();
  searchCtrl = new FormControl();

  loaderService = inject(LoaderService);
  snackbarService = inject(SnackbarService);

  heroes$ = this._heroesFn()
    .pipe(
      tap(() => this.loaderService.showLoader()),
      tap(_ => this.snackbarService.openSnackBar('fetched heroes')),
      delay(2000),
      filter(Boolean),
      map((heroes: Hero[]) => heroes.slice(1, 5)),
      finalize(() => this.loaderService.hideLoader()),
    );

  heroesSearch$ = this.searchCtrl.valueChanges
    .pipe(
      debounceTime(300),
      distinctUntilChanged(),
      shareReplay(1),
      switchMap((term: string) => this._searchFn(term)),
    )
}
