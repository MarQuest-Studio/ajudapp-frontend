import { TestBed } from '@angular/core/testing';
import { HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';

import { tokenInterceptor } from './token.interceptor';
import keycloak from '../services/keycloak.service';

describe('tokenInterceptor', () => {
  const interceptor: HttpInterceptorFn = (req, next) => 
    TestBed.runInInjectionContext(() => tokenInterceptor(req, next));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should add Authorization header with token when authenticated', (done) => {
    // Arrange: set keycloak to authenticated with a token
    Object.defineProperty(keycloak, 'authenticated', { value: true, configurable: true });
    Object.defineProperty(keycloak, 'token', { value: 'abc.123', configurable: true });

    const req = new HttpRequest('GET', '/api/data');

    let capturedReq: HttpRequest<unknown> | undefined;
    const next = (r: HttpRequest<unknown>) => {
      capturedReq = r;
      return of(new HttpResponse({ status: 200 }));
    };

    // Act
    interceptor(req, next).subscribe(() => {
      // Assert
      expect(capturedReq).toBeDefined();
      expect(capturedReq!.headers.get('Authorization')).toBe('Bearer abc.123');
      done();
    });
  });

  it('should add Authorization header with undefined token when not authenticated', (done) => {
    // Arrange: set keycloak to not authenticated
    Object.defineProperty(keycloak, 'authenticated', { value: false, configurable: true });
    // ensure token property is absent or undefined
    Object.defineProperty(keycloak, 'token', { value: undefined, configurable: true });

    const req = new HttpRequest('GET', '/api/data');

    let capturedReq: HttpRequest<unknown> | undefined;
    const next = (r: HttpRequest<unknown>) => {
      capturedReq = r;
      return of(new HttpResponse({ status: 200 }));
    };

    // Act
    interceptor(req, next).subscribe(() => {
      // Assert
      expect(capturedReq).toBeDefined();
      expect(capturedReq!.headers.get('Authorization')).toBe('Bearer undefined');
      done();
    });
  });
});
