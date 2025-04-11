import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom} from '@angular/core';
import { provideRouter } from '@angular/router';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    importProvidersFrom(NgxDaterangepickerMd.forRoot()),
    provideHttpClient() // ✅ This provides HttpClient in standalone apps
  ]

};
