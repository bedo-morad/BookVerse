import {APP_INITIALIZER, ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withFetch,
  withInterceptors,
  withInterceptorsFromDi

} from "@angular/common/http";
import {KeycloakService} from "./services/keycloak/keycloak.service";
import {httpTokenInterceptor} from "./services/interceptor/http-token.interceptor";
import {provideAnimations} from "@angular/platform-browser/animations";
import {provideToastr} from "ngx-toastr";

export function kcFactory(kcService: KeycloakService) {
  return () => kcService.init();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    {
      provide: APP_INITIALIZER,
      deps: [KeycloakService],
      useFactory: kcFactory,
      multi: true
    },
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),
    provideToastr({
      progressBar:true,
      closeButton:true,
      newestOnTop:true,
      tapToDismiss:true,
      positionClass:'toast-bottom-right',
      timeOut: 5000
    }),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: httpTokenInterceptor,
      multi: true
    }
  ]
};
