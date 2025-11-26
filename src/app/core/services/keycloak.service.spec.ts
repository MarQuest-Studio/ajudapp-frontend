import { TestBed } from '@angular/core/testing';

import { KeycloakService } from './keycloak.service';
import { provideHttpClient } from '@angular/common/http';

describe('KeycloakService', () => {
  let service: KeycloakService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()]
    });
    service = TestBed.inject(KeycloakService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
