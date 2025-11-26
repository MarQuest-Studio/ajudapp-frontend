import { CanActivateFn } from '@angular/router';
import keycloak from '../services/keycloak.service';

export const authGuard: CanActivateFn = () => {
  if (keycloak.authenticated) {
    return true;
  }

  keycloak.login();
  return false;
};
