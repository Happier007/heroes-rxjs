import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { InMemoryDataService } from './in-memory-data.service';
import { SnackbarService } from './main/services/snackbar.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule],
  providers: [InMemoryDataService, MatSnackBar, SnackbarService],
  styleUrls: ['./app.component.css'],
  template: `<h1>{{ title }}</h1>
    <nav>
      <a routerLink="/dashboard">Dashboard</a>
      <a routerLink="/heroes">Heroes</a>
    </nav>
    <router-outlet></router-outlet> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  title = 'Tour of Heroes';
}
