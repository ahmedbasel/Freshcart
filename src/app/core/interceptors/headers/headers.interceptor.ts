import { isPlatformBrowser } from '@angular/common';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';

export const headersInterceptor: HttpInterceptorFn = (req, next) => {
  const pLATFORM_ID = inject(PLATFORM_ID)
  if (req.url.includes('cart') || req.url.includes('orders') || req.url.includes('wishlist')) {
    if (isPlatformBrowser(pLATFORM_ID)) {
      req = req.clone({
        setHeaders: {
          token: localStorage.getItem('token')!
        }
      })
    }
  }
  return next(req);
};
