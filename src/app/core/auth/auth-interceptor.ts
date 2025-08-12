import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AppStore } from '../state/app.store';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(AppStore);
  const authToken = store.token();

  // If a token exists, clone the request and add the authorization header
  if (authToken) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken}`
      }
    });
    return next(authReq);
  }

  // If no token, pass the original request along
  return next(req);
};
