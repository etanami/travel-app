const app = require('../src/server/index');
const supertest = require('supertest');
const request = supertest(app);

it('gets the server test endpoint', async (done) => {
  const res = await request.get('/testServer');

  expect(res.body.message).toBe('The server test passed!');
  done();
});
