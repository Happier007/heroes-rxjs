import {importProvidersFrom} from '@angular/core';
import {bootstrapApplication} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';

import {AppComponent} from './app/app.component';
import {AppRoutes} from './app/app.routes';
import {InMemoryDataService} from './app/in-memory-data.service';
import {HttpClientInMemoryWebApiModule} from 'angular-in-memory-web-api';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      RouterModule.forRoot(AppRoutes),
      HttpClientInMemoryWebApiModule.forRoot(
        InMemoryDataService, {dataEncapsulation: false},
      ),
      BrowserAnimationsModule,
      HttpClientModule,
      InMemoryDataService, BrowserAnimationsModule,
    )],
}).catch(err => console.error(err));
