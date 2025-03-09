import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { API_BASE_URL } from '../../../token/api-token';

@Injectable({
  providedIn: 'root'
})
export class BrandsService {
  private products$: Observable<any> | null = null;
  private readonly baseUrl = inject(API_BASE_URL);
  constructor(private httpClient:HttpClient) { }
  getAllBrands(): Observable<any> {
    if (!this.products$) {
      this.products$ = this.httpClient.get(`${this.baseUrl}/api/v1/brands`).pipe(
        shareReplay(1)
      )
    }
    return this.products$;
  }
}
