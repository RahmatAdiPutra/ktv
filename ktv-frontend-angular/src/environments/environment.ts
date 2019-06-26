// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  pusher: {
    key: 'bb225cd958948a709dcb',
    cluster: 'ap1',
    authEndpoint: "/broadcasting/auth",
    httpHost: "sockjs.pusher.com",
    broadcaster: "pusher",
    csrfToken: null,
    disableStats: true,
    host: null,
    namespace: "App.Events",
    wsHost: 'localhost',
    wsPort: 6001,
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
