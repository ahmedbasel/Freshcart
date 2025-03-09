import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from "jwt-decode";
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../token/api-token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userData: any;
  private readonly baseUrl = inject(API_BASE_URL);
  constructor(private httpClient:HttpClient, private router:Router) { }
  register(data: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/api/v1/auth/signup`, data);
  }
  login(data: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/api/v1/auth/signin`, data);
  }
  getUserData():void {
    if (localStorage.getItem('token') !== null) {
      this.userData = jwtDecode(localStorage.getItem('token')!);
      localStorage.setItem('userId', this.userData.id);
    }
  }
  logout():void {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    this.userData = null;
    // call api to remove token
    this.router.navigateByUrl('/auth/login');
  }
  verifyEmail(data: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/api/v1/auth/forgotPasswords`, data);
  }
  verifyCode(data: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/api/v1/auth/verifyResetCode`, data);
  }
  resetPassword(data: any): Observable<any> {
    return this.httpClient.put(`${this.baseUrl}/api/v1/auth/resetPassword`, data);
  }
}
