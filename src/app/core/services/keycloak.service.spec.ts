import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { KeycloakService, initializeKeycloak } from './keycloak.service';
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

// Additional tests to cover initializeKeycloak and setupRefreshToken behavior
describe('Keycloak initialization and refresh setup', () => {
  afterEach(() => {
    // restore any properties to avoid leakage between tests
    try {
  // remove configurable property if previously defined
  delete (keycloak as unknown as { authenticated?: unknown }).authenticated;
    } catch {
      // ignore
    }
  });

  it('initializeKeycloak should call keycloak.init and schedule token refresh that calls updateToken when authenticated', async () => {
    let capturedCb: (() => void) | undefined;

    const originalSetInterval = globalThis.setInterval;
    (globalThis as unknown as { setInterval: (cb: () => void, ms?: number) => number }).setInterval = (cb: () => void) => {
      capturedCb = cb;
      return 123;
    };

    const initSpy = spyOn(keycloak, 'init').and.returnValue(Promise.resolve(true));
    const updateSpy = spyOn(keycloak, 'updateToken').and.returnValue(Promise.resolve(true));

    // ensure authenticated is true so updateToken path runs
    Object.defineProperty(keycloak, 'authenticated', {
      value: true,
      configurable: true
    });

    const initializer = initializeKeycloak();
    // call the initializer function returned
    await initializer();

    expect(initSpy).toHaveBeenCalled();
    expect(typeof capturedCb).toBe('function');

    // invoke the scheduled callback and assert updateToken is called with 30s
    capturedCb!();
    // wait for microtasks so promise chains execute
    await Promise.resolve();

    expect(updateSpy).toHaveBeenCalledWith(30);

    // restore original setInterval
    globalThis.setInterval = originalSetInterval;
  });

  it('setupRefreshToken should call login if updateToken fails', async () => {
    let capturedCb: (() => void) | undefined;

    const originalSetInterval2 = globalThis.setInterval;
    (globalThis as unknown as { setInterval: (cb: () => void, ms?: number) => number }).setInterval = (cb: () => void) => {
      capturedCb = cb;
      return 456;
    };

    spyOn(keycloak, 'init').and.returnValue(Promise.resolve(true));
    const updateSpy = spyOn(keycloak, 'updateToken').and.returnValue(Promise.reject(new Error('token failed')));
    const loginSpy = spyOn(keycloak, 'login');

    Object.defineProperty(keycloak, 'authenticated', {
      value: true,
      configurable: true
    });

    const initializer = initializeKeycloak();
    await initializer();

    // call the scheduled callback which will trigger updateToken().catch(() => login())
    capturedCb!();
    // allow promise rejection catch handlers to run
    await Promise.resolve();

    expect(updateSpy).toHaveBeenCalledWith(30);
    expect(loginSpy).toHaveBeenCalled();

    // restore original setInterval
    globalThis.setInterval = originalSetInterval2;
  });
});


