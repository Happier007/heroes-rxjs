import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {CommonModule, Location} from '@angular/common'
import {FormsModule} from '@angular/forms';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {delay, filter, finalize, map, switchMap, tap} from 'rxjs';

import {heroFn, updateFn} from '../api.heroes';
import {Hero} from '../interfaces/hero.interface';
import {LoaderService} from '../services/loader.service';
import {SnackbarService} from '../services/snackbar.service';

@Component({
  selector: 'app-hero-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroDetailComponent {
  readonly _heroFn = heroFn();
  readonly _updateFn = updateFn();

  route = inject(ActivatedRoute);
  location = inject(Location);
  loaderService = inject(LoaderService);
  snackbarService = inject(SnackbarService);

  hero$ = this.route.paramMap.pipe(
    map((params: ParamMap) => Number(params.get('id'))),
    filter(Boolean),
    tap(() => this.loaderService.showLoader()),
    delay(2000),
    switchMap((id: number) => this._heroFn(id).pipe(
      tap(_ => this.snackbarService.openSnackBar(`fetched hero id=${id}`)),
      finalize(() => this.loaderService.hideLoader()),
    )),
  );

  goBack(): void {
    this.location.back();
  }

  save(hero: Hero): void {
    if (hero) {
      this._updateFn(hero)
        .subscribe(() => this.goBack());
    }
  }
}
