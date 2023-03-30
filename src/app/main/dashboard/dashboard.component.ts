import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLinkWithHref } from '@angular/router';
import {
  distinctUntilChanged,
  debounceTime,
  startWith,
  Subject,
  switchMap,
  map,
  tap,
  finalize,
  share,
} from 'rxjs';
import { BLUR_FILTER } from '../../common/const';

import { searchFn } from '../api.heroes';
import { SpinnerDirective } from '../directives/spinner.directive';
import { HeroSearchComponent } from '../hero-search/hero-search.component';
import { SnackbarService } from '../services/snackbar.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLinkWithHref,
    ReactiveFormsModule,
    HeroSearchComponent,
    MatProgressSpinnerModule,
    SpinnerDirective,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  readonly _searchFn = searchFn();
  readonly searchCtrl = new FormControl();
  readonly spinner$ = new Subject<boolean>();
  readonly blured$ = new Subject<boolean>();

  private readonly snackbarService = inject(SnackbarService);

  readonly heroes$ = this.searchCtrl.valueChanges.pipe(
    startWith(''),
    debounceTime(500),
    distinctUntilChanged(),
    tap(() => {
      this.spinner$.next(true);
      this.blured$.next(true);
    }),
    switchMap((term: string) =>
      this._searchFn(term).pipe(
        finalize(() => {
          this.spinner$.next(false);
          this.blured$.next(false);
        }),
      ),
    ),
    share(),
  );

  readonly bluredHeroes$ = this.blured$.pipe(
    tap((data) => console.log(data)),
    map((data) => (data ? BLUR_FILTER : '')),
  );
}

// heroes$ = this.searchCtrl.valueChanges.pipe(
//     debounceTime(500),
//     startWith(''),
//     // scan((acc, t) => t ? acc.concat(t) : [], []),
//     scan((previousValue, currentValue) => {
//       return previousValue !== '' && currentValue.startsWith(previousValue)
//         ? previousValue
//         : currentValue;
//     }, ''),
//     // tap()
//     tap((data) => console.log(data)),
//     // map((items) => {
//     //   const previousValue = items.pop();
//     //   console.log(currentValue);
//     //   return previousValue !== '' && currentValue.startsWith(previousValue) || !currentValue
//     //     ? previousValue
//     //     : currentValue;
//     // }),
//     // scan((acc: string[], currentValue: string) => {
//     //
//     //   // const previousValue = acc.pop();
//     //   // console.log(currentValue);
//   // return previousValue !== '' && currentValue.startsWith(previousValue) || !currentValue
//     //   //   ? previousValue
//     //   //   : currentValue;
//     //
//     // }, ''),
//     switchMap((term: string) => this._searchFn(term).pipe(
//       catchError(error => of([])),
//     )),
//     // startWith(''),
//   )
