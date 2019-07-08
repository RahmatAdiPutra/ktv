import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SongService {

  endPoint = 'http://localhost/1001/ktv/transaction-data/song/data';

  constructor(private http: HttpClient) { }

  getSongs(params) {
    return this.http.get(this.endPoint,{
      params:params
    }).pipe(catchError(this.errorHandler));
  }

  errorHandler(error: HttpErrorResponse) {
    return throwError(error.message || "Server error");
  }
}
