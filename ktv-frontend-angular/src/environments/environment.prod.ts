export const environment = {
  production: true,
  hostVideo: 'http://192.168.7.224/',
  apiUrl: '/ktv/server',
  pusher: {
    httpHost: window.location.hostname,
    wsHost: window.location.hostname,
    authEndpoint: '/ktv/server/broadcasting/auth',
    key: '2c5db2342d2bbac9a70b',
    cluster: 'ap1'
  }
};
