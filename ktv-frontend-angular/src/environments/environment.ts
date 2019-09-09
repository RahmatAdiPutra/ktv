// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  endpoint: 'http://localhost/1001/ktv/',
  hostVideo: 'http://192.168.7.224/',
  apiUrl: 'http://localhost/_alexisgroup/KTV-v2/server',
  pusher: {
    httpHost: window.location.hostname,
    wsHost: window.location.hostname,
    authEndpoint: 'http://localhost/_alexisgroup/KTV-v2/server/broadcasting/auth',
    key: '2c5db2342d2bbac9a70b',
    cluster: 'ap1'
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
