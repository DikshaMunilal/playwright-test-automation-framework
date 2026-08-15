import { test, expect } from '@playwright/test';

test('service health check responds', async ({ request }) => {
  const res = await request.get('/ping');
  expect(res.status()).toBe(201); // Restful-Booker health check returns 201
});