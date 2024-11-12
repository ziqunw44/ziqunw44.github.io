import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter,withViewTransitions,withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';



export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideClientHydration(),provideHttpClient(withFetch()),provideRouter(routes, withViewTransitions())]
};
