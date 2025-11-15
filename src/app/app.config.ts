import { ApplicationConfig, provideZoneChangeDetection, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { regionsReducer } from './state/regions/regions.reducer';
import { RegionsEffects } from './state/regions/regions.effects';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideStore({ regions: regionsReducer }), provideEffects([RegionsEffects]), provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() })]
};
