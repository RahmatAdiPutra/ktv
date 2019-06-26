import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import * as Pusher from 'pusher-js';

@Injectable({
  providedIn: 'root'
})
export class PusherService {

  pusher: any;
  channel: any;

  constructor() {
    this.pusher = new Pusher(environment.pusher.key, {
      cluster: environment.pusher.cluster,
      encrypted: true,
      key: environment.pusher.key,
      authEndpoint: environment.pusher.authEndpoint,
      // httpHost: environment.pusher.httpHost,
      broadcaster: environment.pusher.broadcaster,
      csrfToken: environment.pusher.csrfToken,
      disableStats: environment.pusher.disableStats,
      host: environment.pusher.host,
      namespace: environment.pusher.namespace,
      wsHost: environment.pusher.wsHost,
      wsPort: environment.pusher.wsPort,
    });
    this.channel = this.pusher.subscribe('remote');
    console.log(window);
  }
}
