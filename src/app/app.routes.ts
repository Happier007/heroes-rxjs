import {Routes} from '@angular/router';
import {DashboardComponent} from './main/dashboard/dashboard.component';
import {HeroDetailComponent} from './main/hero-detail/hero-detail.component';
import {HeroesComponent} from './main/heroes/heroes.component';

export const AppRoutes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
  },

  {
    path: 'detail/:id',
    component: HeroDetailComponent,
  },

  {
    path: 'heroes',
    component: HeroesComponent,
  },

  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },

  {
    path: '**',
    redirectTo: 'dashboard',
  },
]
