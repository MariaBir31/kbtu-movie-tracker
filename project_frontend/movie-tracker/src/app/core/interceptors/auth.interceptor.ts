import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('access');

  const isAuthRequest = req.url.includes('/auth/login/') || req.url.includes('/auth/register/');

  if (token && !isAuthRequest) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('Interceptor: Token attached to protected route');
    return next(cloned);
  }

  console.log('Interceptor: Sending request without token');
  return next(req);
};
