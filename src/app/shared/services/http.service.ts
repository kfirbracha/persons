import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private httpClient: HttpClient) {}

  public get<T>(url: string, config?: any): Observable<T> {
    return this.httpClient.get<T>(url, config) as Observable<T>;
  }

  public post<D, T>(url: string, data?: D, config?: any): Observable<T> {
    return this.httpClient.post<T>(url, data, config) as Observable<T>;
  }
}
