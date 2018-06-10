import sc2 from 'sc2-sdk';

const api = sc2.Initialize({
      app: 'steemia.app',
      callbackURL: 'http://localhost:8100',
});

export default api;