import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import Echo from 'laravel-echo';
import { Router } from '@angular/router';

declare global {
  interface Window { Echo: any; }
}

@Injectable({
  providedIn: 'root'
})
export class PusherService {

  constructor(private router: Router) {
    window.Echo = new Echo({
      broadcaster: 'pusher',
      authEndpoint: environment.pusher.authEndpoint,
      key: environment.pusher.key,
      httpHost: environment.pusher.httpHost,
      cluster: 'ap1',
      encrypted: false,
      disableStats: true,
      wsHost: environment.pusher.wsHost,
      wsPort: 6001
    });

    window.Echo.connector.pusher.connection.bind('state_change', (states: any) => {
      // console.log(states);
      if (states.previous === 'unavailable' && states.current === 'connected') {
        // console.log('Socket ' + states.current);
        this.router.navigate(['/']);
      } else if (states.previous === 'connecting' && states.current === 'unavailable') {
        // console.log('Socket ' + states.current);
        this.router.navigate(['/' + states.current]);
      }
    });
  }
}
