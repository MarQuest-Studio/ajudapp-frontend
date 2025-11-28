import { HttpInterceptorFn } from '@angular/common/http';
import keycloak from '../services/keycloak.service';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const token = keycloak.authenticated ? keycloak.token : undefined;

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(authReq);
};
