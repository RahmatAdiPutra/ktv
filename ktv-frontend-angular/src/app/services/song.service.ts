import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Order } from 'src/app/classes/order';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SongService {

  endpoint = environment.endpoint;

  constructor(private http: HttpClient) { }

  getLanguage() {
    return this.http.get(this.endpoint + 'master-data/song/language/data').pipe(catchError(this.errorHandler));
  }

  getSong(data) {
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

    return this.http.get(this.endpoint + 'transaction-data/song/data', {params}).pipe(catchError(this.errorHandler));
  }

  getSearch(data) {
    let params = new HttpParams();

    // tslint:disable-next-line: forin
    for (const key in data) {
      params = params.append(key, data[key]);
    }

    return this.http.get(this.endpoint + 'api/search', {params}).pipe(catchError(this.errorHandler));
  }

  errorHandler(error: HttpErrorResponse) {
    return throwError(error.message || 'Server error');
  }
}
