const assert = require('assert');
const Provider = require('oidc-provider');

assert(process.env.HEROKU_APP_NAME, 'process.env.HEROKU_APP_NAME missing');
assert(process.env.PORT, 'process.env.PORT missing');
assert(process.env.SECURE_KEY, 'process.env.SECURE_KEY missing, run `heroku addons:create securekey`');
assert.strictEqual(process.env.SECURE_KEY.split(',').length, 2, 'process.env.SECURE_KEY format invalid');

const oidc = new Provider(`https://${process.env.HEROKU_APP_NAME}.herokuapp.com`, {
  clients: [
    {
      client_id: 'foo',
      client_secret: 'bar',
      redirect_uris: ['http://lvh/cb'],
    }
  ]
});

oidc.proxy = true;

oidc.keys = proces.env.SECURE_KEY.split(',');

const port = process.env.PORT;
oidc.listen(port);
