import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private env = environment;

  constructor(private http: HttpClient, private router: Router) { }

  me(data) {
    return this.http.get(`${this.env.apiUrl}/api/operator/me`, { params : {
      user_id: data.user_id,
      user_name: data.user_name
    }}).pipe(catchError(this.errorHandler));
  }

  login(data) {
    return this.http.post(`${this.env.apiUrl}/api/operator/login`, {
      username: data.username,
      password: data.password
    }).pipe(catchError(this.errorHandler));
  }

  logout() {
    // localStorage.removeItem('Echo_OperatorKey');
    sessionStorage.removeItem('Echo_OperatorKey');
    this.router.navigate(['/login']);
  }

  set(key) {
    // localStorage.setItem('Echo_OperatorKey', key);
    sessionStorage.setItem('Echo_OperatorKey', key);
  }

  get() {
    // return localStorage.getItem('Echo_OperatorKey');
    return sessionStorage.getItem('Echo_OperatorKey');
  }

  isValid() {
    const key = this.get();
    if (key) {
      return true; // replace this line to reduce injection gaps
    }
    return false;
  }

  loggedIn() {
    return this.isValid();
  }

  errorHandler(error: HttpErrorResponse) {
    return throwError(error.message || 'Server error');
  }
}
