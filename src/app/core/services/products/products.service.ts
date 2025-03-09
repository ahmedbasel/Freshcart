import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';
import { API_BASE_URL } from '../../../token/api-token';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private products$: Observable<any> | null = null;
  private readonly baseUrl = inject(API_BASE_URL);
  constructor(private httpClient:HttpClient) { }
  getAllProducts(page: number, limit: number): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/api/v1/products`, {
      params: {
        page,
        limit
      }
    });
  }
  getStaticProducts(): Observable<any> {
    if(!this.products$) {
      this.products$ = this.httpClient.get(`${this.baseUrl}/api/v1/products`).pipe(
        map((res: any) => res.data.slice(0,12)),
        shareReplay(1)
      )
    }
    return this.products$;
  }
  getProductById(id: string): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/api/v1/products/${id}`);
  }
}
