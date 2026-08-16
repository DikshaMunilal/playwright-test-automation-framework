import { test, expect } from '../../src/fixtures/api.fixtures.js';

test.describe('authentication', () => {
  test('service health check responds', async ({ request }) => {
    const res = await request.get('/ping');
    expect(res.status()).toBe(201);
  });

  test('valid credentials return a token', async ({ request }) => {
    const res = await request.post('/auth', {
      data: { username: process.env.API_USERNAME, password: process.env.API_PASSWORD },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.token).toEqual(expect.any(String));
    expect(body.token.length).toBeGreaterThan(0);
  });

  test('invalid credentials are rejected', async ({ request }) => {
    const res = await request.post('/auth', {
      data: { username: 'wrong', password: 'wrong' },
    });
    // API quirk: returns 200 with a reason body instead of 401
    expect(res.status()).toBe(200);
    expect(await res.json()).toEqual({ reason: 'Bad credentials' });
  });
});