import { ChangeDetectionStrategy, Component, Inject, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import {
  BehaviorSubject,
  catchError,
  Observable,
  delay,
  filter,
  map,
  of,
  switchMap,
  takeUntil,
  tap,
  Subject,
} from 'rxjs';

import { heroFn, updateFn } from '../api.heroes';
import { SpinnerDirective } from '../directives/spinner.directive';
import { Hero } from '../interfaces/hero.interface';
import { DestroyedService } from '../services/destroyed.service';
import { SnackbarService } from '../services/snackbar.service';

@Component({
  selector: 'app-hero-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, SpinnerDirective],
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroyedService],
})
export class HeroDetailComponent {
  readonly _heroFn = heroFn();
  readonly _updateFn = updateFn();
  readonly spinner$ = new Subject<boolean>();
  readonly disabledBtn$ = new BehaviorSubject<boolean>(false);

  private _route = inject(ActivatedRoute);
  private _location = inject(Location);
  private _snackbarService = inject(SnackbarService);

  constructor(@Inject(DestroyedService) private readonly _destroyed$: Observable<void>) {}

  hero$ = this._route.paramMap.pipe(
    map((params: ParamMap) => params.get('id') as string),
    filter(Boolean),
    switchMap((id: string) =>
      this._heroFn(Number(id)).pipe(
        tap((_) => this._snackbarService.openSnackBar(`fetched hero id=${id}`)),
        catchError((_) => of({} as Hero)),
      ),
    ),
  );

  goBack(): void {
    this._location.back();
  }

  save(hero: Hero): void {
    if (!hero) return;

    this._updateFn(hero)
      .pipe(
        tap(() => {
          this.spinner$.next(true);
          this.disabledBtn$.next(true);
        }),
        delay(2000),
        takeUntil(this._destroyed$),
      )
      .subscribe({
        next: () => this.goBack(),
        error: () => {
          this.spinner$.next(false);
          this.disabledBtn$.next(false);
        },
        complete: () => this.spinner$.next(false),
      });
  }
}
