import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  defaultLang = 'en';
  constructor(private translateService: TranslateService, @Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      const savedLang = localStorage.getItem('lang');
      if (savedLang) {
        this.defaultLang = savedLang;
      }
      this.translateService.setDefaultLang(this.defaultLang);
      this.translateService.use(this.defaultLang);
      this.changeDir();
    }
  }
  changeLang(lang: string) {
    this.translateService.use(lang);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('lang', lang);
      this.changeDir();
    }
  }
  changeDir(): void {
    const savedLang = localStorage.getItem('lang');
    if (savedLang === 'en') {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = "en";
    } else if(savedLang === 'ar') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = "ar";
    }
  }
}
