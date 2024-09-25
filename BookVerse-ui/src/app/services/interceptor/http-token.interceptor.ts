import {
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import {Injectable} from "@angular/core";
import {KeycloakService} from "../keycloak/keycloak.service";
import {Observable} from "rxjs";

@Injectable()
export class httpTokenInterceptor implements HttpInterceptor {

  constructor(
    private keycloakService: KeycloakService
  ) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.keycloakService.keycloak.token
    if (token) {
      const authReq = req.clone(
        {
          headers: new HttpHeaders({
            Authorization: `Bearer ${token}`
          })
        })
      return next.handle(authReq)
    }
    return next.handle(req)
  }
}
