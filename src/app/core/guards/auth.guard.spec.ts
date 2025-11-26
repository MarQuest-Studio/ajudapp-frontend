import { TestBed } from '@angular/core/testing';
import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { authGuard } from './auth.guard';
import keycloak from '../services/keycloak.service';

describe('authGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => authGuard(...guardParameters));

  let mockRoute: ActivatedRouteSnapshot;
  let mockState: RouterStateSnapshot;

  beforeEach(() => {
    TestBed.configureTestingModule({});

    // Mock route and router state
    mockRoute = {} as ActivatedRouteSnapshot;
    mockState = { url: '/protected' } as RouterStateSnapshot;
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should return true when user is authenticated', () => {
    const loginSpy = spyOn(keycloak, 'login');
    // Set authenticated state
    Object.defineProperty(keycloak, 'authenticated', {
      value: true,
      configurable: true
    });
    
    const result = executeGuard(mockRoute, mockState);
    
    expect(result).toBe(true);
    expect(loginSpy).not.toHaveBeenCalled();
  });

  it('should return false when user is not authenticated', () => {
    // Set authenticated state to false
    Object.defineProperty(keycloak, 'authenticated', {
      value: false,
      configurable: true
    });
    
    const loginSpy = spyOn(keycloak, 'login');
    const result = executeGuard(mockRoute, mockState);
    
    expect(result).toBe(false);
    expect(loginSpy).toHaveBeenCalled();
  });

  it('should call keycloak.login() when user is not authenticated', () => {
    const loginSpy = spyOn(keycloak, 'login');
    Object.defineProperty(keycloak, 'authenticated', {
      value: false,
      configurable: true
    });
    
    executeGuard(mockRoute, mockState);
    
    expect(loginSpy).toHaveBeenCalled();
  });

  it('should not call keycloak.login() when user is already authenticated', () => {
    const loginSpy = spyOn(keycloak, 'login');
    Object.defineProperty(keycloak, 'authenticated', {
      value: true,
      configurable: true
    });
    
    executeGuard(mockRoute, mockState);
    
    expect(loginSpy).not.toHaveBeenCalled();
  });

  it('should handle multiple guard checks independently', () => {
    const loginSpy = spyOn(keycloak, 'login');

    // First check: not authenticated
    Object.defineProperty(keycloak, 'authenticated', {
      value: false,
      configurable: true
    });
    const firstCheck = executeGuard(mockRoute, mockState);
    expect(firstCheck).toBe(false);
    expect(loginSpy).toHaveBeenCalledTimes(1);

    // Reset spy
    loginSpy.calls.reset();

    // Second check: now authenticated
    Object.defineProperty(keycloak, 'authenticated', {
      value: true,
      configurable: true
    });
    const secondCheck = executeGuard(mockRoute, mockState);
    expect(secondCheck).toBe(true);
    expect(loginSpy).not.toHaveBeenCalled();
  });

  it('should handle undefined authentication state as not authenticated', () => {
    const loginSpy = spyOn(keycloak, 'login');
    Object.defineProperty(keycloak, 'authenticated', {
      value: undefined,
      configurable: true
    });
    
    const result = executeGuard(mockRoute, mockState);
    
    expect(result).toBe(false);
    expect(loginSpy).toHaveBeenCalled();
  });
});
