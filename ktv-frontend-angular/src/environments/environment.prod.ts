export const environment = {
  production: true,
  endpoint: 'http://localhost/1001/ktv/',
  apiUrl: '/ktv/server',
  pusher: {
    httpHost: window.location.hostname,
    wsHost: window.location.hostname,
    authEndpoint: '/ktv/server/broadcasting/auth',
    key: '2c5db2342d2bbac9a70b',
    cluster: 'ap1'
  }
};
