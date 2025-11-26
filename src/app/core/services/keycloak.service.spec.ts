import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { KeycloakService } from './keycloak.service';
import { provideHttpClient } from '@angular/common/http';
import keycloak from './keycloak.service';

describe('KeycloakService', () => {
  let service: KeycloakService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        KeycloakService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(KeycloakService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('isAuthenticated should return a boolean', () => {
    Object.defineProperty(keycloak, 'authenticated', {
      value: true,
      configurable: true
    });
    const result = service.isAuthenticated;
    expect(typeof result).toBe('boolean');
    expect(result).toBe(true);
  });

  it('isAuthenticated should return false when keycloak is not authenticated', () => {
    // Keycloak starts as not authenticated in test environment
    Object.defineProperty(keycloak, 'authenticated', {
      value: false,
      configurable: true
    });
    const result = service.isAuthenticated;
    expect(result).toBe(false);
  });

  it('login should call keycloak.login()', () => {
    const loginSpy = spyOn(keycloak, 'login');
    
    service.login();
    
    expect(loginSpy).toHaveBeenCalled();
  });

  it('logoutKeycloak should make HTTP GET request to logout URL', () => {
    const createLogoutUrlSpy = spyOn(keycloak, 'createLogoutUrl').and.returnValue('http://localhost:8080/logout');
    
    service.logoutKeycloak();
    
    const req = httpMock.expectOne('http://localhost:8080/logout');
    expect(createLogoutUrlSpy).toHaveBeenCalled();
    expect(req.request.method).toBe('GET');
    req.flush(null);
  });

  it('service should inject http client', () => {
    expect(service['http']).toBeDefined();
  });
});


