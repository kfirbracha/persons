import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private httpClient: HttpClient) {}

  public get<T>(url: string, config?: any): Observable<T> {
    return this.httpClient
      .get<T>(url, config)
      .pipe(catchError(this.handleError)) as Observable<T>;
  }

  public post<D, T>(url: string, data?: D, config?: any): Observable<T> {
    return this.httpClient
      .post<T>(url, data, config)
      .pipe(catchError(this.handleError)) as Observable<T>;
  }

  private handleError(error: any) {
    return throwError(() => new Error(error));
  }
}
