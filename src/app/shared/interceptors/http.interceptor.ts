import { HttpInterceptorFn } from '@angular/common/http';
import { finalize } from 'rxjs';
import { environment } from '../../../environments/environment';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  const baseUrl = environment.apiServerBaseUrl;

  const newReq = req.clone({
    url: baseUrl + req.url,
  });
  return next(newReq).pipe(finalize(() => {}));
};
