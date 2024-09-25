import {Injectable} from '@angular/core';
import Keycloak from "keycloak-js";
import {UserProfile} from "./user-profile";

@Injectable({
  providedIn: 'root'
})
export class KeycloakService {

  private _keycloak: Keycloak | undefined
  private _profile: UserProfile | undefined

  get keycloak() {
    if (!this._keycloak) {
      this._keycloak = new Keycloak({
        url: 'http://localhost:9090',
        realm: 'book-verse',
        clientId: 'book-verse'
      })
    }
    return this._keycloak;
  }

  get profile(): UserProfile | undefined {
    return this._profile;
  }

  constructor() {
  }

  async init() {
    const authenticated = await this.keycloak.init({
      onLoad: 'login-required',
    });
    if (authenticated) {
      this._profile = (await this._keycloak?.loadUserProfile()) as UserProfile;
      this._profile.token = this._keycloak?.token;
    }
  }

  login() {
    return this._keycloak?.login()
  }

  logout() {
    return this._keycloak?.logout()
  }

  accountManagement() {
    return this._keycloak?.accountManagement()
  }
}

