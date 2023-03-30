import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLinkWithHref } from '@angular/router';
import {
  BehaviorSubject,
  combineLatest,
  Subject,
  takeUntil,
  Observable,
  repeat,
  map,
  tap,
  delay,
} from 'rxjs';

import { addFn, deleteFn, heroesFn } from '../api.heroes';
import { SpinnerDirective } from '../directives/spinner.directive';
import { Hero } from '../interfaces/hero.interface';
import { DestroyedService } from '../services/destroyed.service';

@Component({
  selector: 'app-heroes',
  standalone: true,
  imports: [CommonModule, RouterLinkWithHref, SpinnerDirective],
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroyedService],
})
export class HeroesComponent {
  readonly _heroesFn = heroesFn();
  readonly _addFn = addFn();
  readonly _deleteFn = deleteFn();
  readonly spinner$ = new Subject<boolean>();

  private heroesStore$ = new BehaviorSubject<Hero[]>([]);
  private heroesRefresh$ = new Subject<void>();

  constructor(@Inject(DestroyedService) private readonly _destroyed$: Observable<void>) {}

  readonly heroes$ = combineLatest([
    this._heroesFn().pipe(
      tap(() => this.spinner$.next(true)),
      delay(2000),
      tap((heroes) => this.heroesStore$.next(heroes)),
      repeat({ delay: () => this.heroesRefresh$ }),
    ),
    this.heroesStore$,
  ]).pipe(
    map(([_, heroes]) => heroes),
    tap(() => this.spinner$.next(false)),
  );

  add(name: string): void {
    name = name.trim();
    if (!name) {
      return;
    }

    this._addFn({ name } as Hero)
      .pipe(takeUntil(this._destroyed$))
      .subscribe(() => this.heroesRefresh$.next());
  }

  delete(hero: Hero): void {
    this._deleteFn(hero.id)
      .pipe(takeUntil(this._destroyed$))
      .subscribe(() => {
        const heroes = this.heroesStore$.value.filter((heroItem: Hero) => heroItem.id !== hero.id);
        this.heroesStore$.next(heroes);
      });
  }
}
