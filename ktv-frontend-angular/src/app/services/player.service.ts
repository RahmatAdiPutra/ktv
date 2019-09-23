import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  endpoint = '';

  constructor(private http: HttpClient) { }

  getPlayer() {
    let headers = new HttpHeaders();
    headers = headers.append('X-Echo-Room-Key', 'ABCD123412');
    return this.http.get(this.endpoint + 'api/room-session/3XMG9T3AZUEY', {headers}).pipe(catchError(this.errorHandler));
  }

  player(data) {
    return this.http.post(this.endpoint + 'transaction-data/room/room-player', data).pipe(catchError(this.errorHandler));
  }

  errorHandler(error: HttpErrorResponse) {
    return throwError(error.message || 'Server error');
  }
}
