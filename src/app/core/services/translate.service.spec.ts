import { TestBed } from '@angular/core/testing';
import { TranslateLoader, TranslateModule, TranslateNoOpLoader, TranslateService } from '@ngx-translate/core';

import { AppTranslateService } from './translate.service';

describe('TranslateService', () => {
  let service: AppTranslateService;
  let translateService: TranslateService;

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
    translateService = TestBed.inject(TranslateService);
    // Reset the BehaviorSubject to default state
    service.currentLang.next('en-US');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with default language en-US', () => {
    spyOn(translateService, 'getBrowserCultureLang').and.returnValue(undefined);
    service.initializeLanguage();
    expect(service.getCurrentLanguage()).toBe('en-US');
  });

  it('should set language and update currentLang BehaviorSubject', () => {
    service.setLanguage('pt-PT');
    expect(service.getCurrentLanguage()).toBe('pt-PT');
  });

  it('should emit language change through currentLang$ observable', (done) => {
    service.currentLang$.subscribe((lang) => {
      if (lang === 'pt-PT') {
        expect(lang).toBe('pt-PT');
        done();
      }
    });
    service.setLanguage('pt-PT');
  });

  it('should use TranslateService to set the language', () => {
    spyOn(translateService, 'use');
    service.setLanguage('pt-PT');
    expect(translateService.use).toHaveBeenCalledWith('pt-PT');
  });

  it('should return current language via getCurrentLanguage', () => {
    service.setLanguage('en-US');
    expect(service.getCurrentLanguage()).toBe('en-US');
    service.setLanguage('pt-PT');
    expect(service.getCurrentLanguage()).toBe('pt-PT');
  });

  it('initializeLanguage should use default language when browser lang is unsupported', () => {
    spyOn(translateService, 'getBrowserCultureLang').and.returnValue('fr-FR');
    spyOn(translateService, 'use');
    service.initializeLanguage();
    expect(translateService.use).toHaveBeenCalledWith('en-US');
  });

  it('initializeLanguage should use browser language when supported', () => {
    spyOn(translateService, 'getBrowserCultureLang').and.returnValue('pt-PT');
    spyOn(translateService, 'use');
    service.initializeLanguage();
    expect(translateService.use).toHaveBeenCalledWith('pt-PT');
  });

  it('initializeLanguage should handle null browser language', () => {
    spyOn(translateService, 'getBrowserCultureLang').and.returnValue(undefined);
    spyOn(translateService, 'use');
    service.initializeLanguage();
    expect(translateService.use).toHaveBeenCalledWith('en-US');
  });
});
