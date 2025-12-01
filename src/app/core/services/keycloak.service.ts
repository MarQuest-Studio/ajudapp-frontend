import { Injectable, isDevMode } from '@angular/core';
import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'http://localhost:8080/',
  realm: 'angular-app',
  clientId: 'angular-app'
});

function setupRefreshToken() {
  setInterval(() => {
    if (keycloak.authenticated) {
      keycloak.updateToken(30).catch(() => keycloak.login());
    }
  }, 10000);
}

export function initializeKeycloak() {

  console.log('Initializing Keycloak...');
  return () =>
    keycloak.init({
      enableLogging: isDevMode(),
      onLoad: 'check-sso',
      checkLoginIframe: false,
      silentCheckSsoRedirectUri:
        globalThis.location.origin + '/assets/authentication/silent-check-sso.html'
    }).then(() => {
        setupRefreshToken(); // every 10 seconds
    });
}

export default keycloak;


@Injectable({
  providedIn: 'root',
})
export class KeycloakService {

  public logout() {
    keycloak.logout();
  }

  public login() {
    keycloak.login();
  }

  get isAuthenticated(): boolean {
    return keycloak.authenticated ?? false;
  }
}
