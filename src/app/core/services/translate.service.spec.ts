import { TestBed } from '@angular/core/testing';
import { TranslateLoader, TranslateModule, TranslateNoOpLoader } from '@ngx-translate/core';

import { AppTranslateService } from './translate.service';

describe('TranslateService', () => {
  let service: AppTranslateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateNoOpLoader,
          },
        }),
      ],
    });
    service = TestBed.inject(AppTranslateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
