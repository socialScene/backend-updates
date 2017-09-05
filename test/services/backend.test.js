const assert = require('assert');
const app = require('../../src/app');

describe('\'backend\' service', () => {
  it('registered the service', () => {
    const service = app.service('backend');

    assert.ok(service, 'Registered the service');
  });
});
