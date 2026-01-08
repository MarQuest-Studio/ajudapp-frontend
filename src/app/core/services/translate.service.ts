import { inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppTranslateService {
  readonly currentLang = new BehaviorSubject<string>('en-US');
  readonly translate = inject(TranslateService);
  public currentLang$ = this.currentLang.asObservable();

  initializeLanguage(): void {
    const browserLang = this.translate.getBrowserLang() || 'en-US';
    const defaultLang = 'en-US';
    const supportedLanguages = ['en-US', 'pt-PT'];

    const langToUse = supportedLanguages.includes(browserLang) ? browserLang : defaultLang;
    this.setLanguage(langToUse);
  }

  setLanguage(lang: string): void {
    this.translate.use(lang);
    this.currentLang.next(lang);
  }

  getCurrentLanguage(): string {
    return this.currentLang.value;
  }
}