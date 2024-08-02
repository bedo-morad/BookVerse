import {HttpHeaders, HttpInterceptorFn} from '@angular/common/http';

export const httpTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token') as string;
  if (token) {
    const authReq = req.clone({
      headers: new HttpHeaders({
          Authorization: 'Bearer ' + token
        }
      )
    })
    return next(authReq)
  }
  return next(req);
};
