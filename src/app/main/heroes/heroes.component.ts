import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterLinkWithHref} from '@angular/router';
import {catchError, of, switchMap} from 'rxjs';

import {addFn, deleteFn, heroesFn} from '../api.heroes';
import {Hero} from '../interfaces/hero.interface';

@Component({
  selector: 'app-heroes',
  standalone: true,
  imports: [CommonModule, RouterLinkWithHref],
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroesComponent {
  readonly _heroesFn = heroesFn();
  readonly _addFn = addFn();
  readonly _deleteFn = deleteFn();

  heroes$ = this._heroesFn();

  add(name: string): void {
    name = name.trim();
    if (!name) { return; }

    this.heroes$ = this._addFn({name} as Hero)
      .pipe(
        switchMap(() => this._heroesFn().pipe(
          catchError(error => of([])),
        )),
      );
  }

  delete(hero: Hero): void {
    this.heroes$ = this._deleteFn(hero.id)
      .pipe(
        switchMap(() => this._heroesFn().pipe(
          catchError(error => of([])),
        )),
      );
  }
}
