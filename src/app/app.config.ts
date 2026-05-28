import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection, isDevMode, provideAppInitializer } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { regionsReducer } from './state/regions/regions.reducer';
import { RegionsEffects } from './state/regions/regions.effects';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { tokenInterceptor } from './core/interceptors/token.interceptor';
import { initializeKeycloak } from './core/services/keycloak.service';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader, provideTranslateHttpLoader } from '@ngx-translate/http-loader';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideStore({ regions: regionsReducer }),
    provideEffects([RegionsEffects]),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    provideAppInitializer(initializeKeycloak()),
    provideHttpClient(
      withInterceptors([tokenInterceptor])
    ),
    importProvidersFrom(
      TranslateModule.forRoot({
        defaultLanguage: 'en-US',
        loader: {
          provide: TranslateLoader,
          useClass: TranslateHttpLoader
        }
      })
    ),
    provideTranslateHttpLoader({
      prefix: '/assets/locale/',
      suffix: '.json'
    })
  ],
};
