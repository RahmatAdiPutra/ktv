import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Order } from 'src/app/classes/order';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  endpoint = '';

  constructor(private http: HttpClient) { }

  getRoom(data) {
    let params = new HttpParams();
    const order = new Order();

    for (const key in data) {
      if (key === order.by.column) {
        params = params.append('order[0][column]', data[key]);
      } else if (key === order.by.dir) {
        params = params.append('order[0][dir]', data[key]);
      } else {
        params = params.append(key, data[key]);
      }
    }

    return this.http.get(this.endpoint + 'data', {params}).pipe(catchError(this.errorHandler));
  }

  getRoomOpen(token) {
    return this.http.get(this.endpoint + 'room-open/' + token).pipe(catchError(this.errorHandler));
  }

  getPlaylist(token) {
    return this.http.get(this.endpoint + 'room-playlist/' + token).pipe(catchError(this.errorHandler));
  }

  getCall() {
    return this.http.get(this.endpoint + 'room-call').pipe(catchError(this.errorHandler));
  }

  postPlaylist(data) {
    return this.http.post(this.endpoint + 'post-playlist', data).pipe(catchError(this.errorHandler));
  }

  postCall(data) {
    return this.http.post(this.endpoint + 'post-call', data).pipe(catchError(this.errorHandler));
  }

  errorHandler(error: HttpErrorResponse) {
    return throwError(error.message || 'Server error');
  }
}
