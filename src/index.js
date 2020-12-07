const assert = require('assert');
const Provider = require('oidc-provider');

assert(process.env.HEROKU_APP_NAME, 'process.env.HEROKU_APP_NAME missing');
assert(process.env.PORT, 'process.env.PORT missing');
assert(process.env.SECURE_KEY, 'process.env.SECURE_KEY missing, run `heroku addons:create securekey`');
assert.strictEqual(process.env.SECURE_KEY.split(',').length, 2, 'process.env.SECURE_KEY format invalid');
assert(process.env.REDIS_URL, 'process.env.REDIS_URL missing, run `heroku-redis:hobby-dev`');

const jwks = require('./jwks.json');

const RedisAdapter = require('./redis_adapter');

const oidc = new Provider(`https://${process.env.HEROKU_APP_NAME}.herokuapp.com`, {
  clients: [
    {
      client_id: 'foo',
      client_secret: 'bar',
      redirect_uris: ['http://lvh/cb'],
    }
  ],
  jwks,
  formats: {
    AccessToken: 'jwt',
  },
  features: {
    encryption: { enabled: true },
    introspection: { enabled: true },
    revocation: { enabled: true },
  },
});

oidc.proxy = true;
oidc.keys = process.env.SECURE_KEY.split(',');

const port = process.env.PORT;
oidc.listen(port);
