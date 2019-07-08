import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import Echo from 'laravel-echo';

declare global {
  interface Window { Echo: any; }
}

@Injectable({
  providedIn: 'root'
})
export class PusherService {

  constructor() {}

  connect() {
    window.Echo = new Echo({
      broadcaster: environment.pusher.broadcaster,
      authEndpoint : environment.pusher.authEndpoint,
      key: environment.pusher.key,
      httpHost: environment.pusher.httpHost,
      cluster: environment.pusher.cluster,
      encrypted: environment.pusher.encrypted,
      disableStats: environment.pusher.disableStats,
      wsHost: environment.pusher.wsHost,
      wsPort: environment.pusher.wsPort
    });
  }
}
