import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners
} from "@angular/core";
import { provideHttpClient, withFetch } from "@angular/common/http";
import { provideRouter } from "@angular/router";

import { routes } from "./app.routes";

// Sem provideZoneChangeDetection nem provideZonelessChangeDetection: no
// Angular 22 zoneless é o padrão implícito e zone.js nem está instalado.
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withFetch()),
    provideRouter(routes)
  ]
};
