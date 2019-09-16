import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OperatorService {

  private env = environment;

  constructor(private http: HttpClient) { }

  room() {
    return this.http.get(`${this.env.apiUrl}/api/operator/room`).pipe(catchError(this.errorHandler));
  }

  song(page?: number) {
    return this.http.get(`${this.env.apiUrl}/api/operator/browse`, { params: { page: `${page}` }}).pipe(catchError(this.errorHandler));
  }

  call() {
    return this.http.get(`${this.env.apiUrl}/api/operator/call`).pipe(catchError(this.errorHandler));
  }

  language() {
    return this.http.get(`${this.env.apiUrl}/api/operator/lang`).pipe(catchError(this.errorHandler));
  }

  search(query, artist?: string, language?: number, page?: number, type: string = 'all', genre?: number) {
    if (query === undefined) {
      query = '';
    }

    if (language === undefined) {
      language = 0;
    }

    if (artist === undefined) {
      artist = '';
    }

    return this.http
      .get(`${this.env.apiUrl}/api/operator/search`, {
        params: {
          q: `${query}`,
          artist: `${artist}`,
          lang: `${language}`,
          page: `${page}`
        }
      }).pipe(catchError(this.errorHandler));
  }

  playlist(key) {
    return this.http.get(`${this.env.apiUrl}/api/controller/init?tv-token=${key}`).pipe(catchError(this.errorHandler));
  }

  playToggle(key) {
    return this.http.post(`${this.env.apiUrl}/api/controller/control/play-toggle?tv-token=${key}`, {
      ok: 1
    }).pipe(catchError(this.errorHandler));
  }

  playing(data) {
    return this.http.post(`${this.env.apiUrl}/api/controller/playlist/play-this-song?tv-token=${data.key}`, {
       id: data.songId
    }).pipe(catchError(this.errorHandler));
  }

  callRespond(key) {
    return this.http.post(`${this.env.apiUrl}/api/controller/call/respond?tv-token=${key}`, {
      who: 'operator'
    }).pipe(catchError(this.errorHandler));
  }

  playlistSongReorder(data) {
    return this.http.post(`${this.env.apiUrl}/api/controller/playlist/reorder?tv-token=${data.key}`, {
      orders: data.dataList
    }).pipe(catchError(this.errorHandler));
  }

  playlistSongAdd(data) {
    return this.http.post(`${this.env.apiUrl}/api/controller/playlist/add?tv-token=${data.key}`, {
      id: data.songId
    }).pipe(catchError(this.errorHandler));
  }

  playlistSongDelete(data) {
    return this.http.delete(`${this.env.apiUrl}/api/controller/playlist/delete-this-song?tv-token=${data.key}`, {
      params: { id: data.songListId }
    }).pipe(catchError(this.errorHandler));
  }

  errorHandler(error: HttpErrorResponse) {
    return throwError(error.message || 'Server error');
  }
}
