import { test as base, expect, request as apiRequest } from '@playwright/test';
import { BookingClient } from '../api/booking.client.js';

export const test = base.extend({
  // Worker-scoped: one auth round-trip per worker instead of one per test
  workerToken: [async ({}, use) => {
    // SETUP , runs before tests
    const ctx = await apiRequest.newContext({ baseURL: process.env.API_BASE_URL }); // Builds on request contex and disposes it so no leaked connections
    const client = new BookingClient(ctx);
    await client.auth(process.env.API_USERNAME, process.env.API_PASSWORD);
    await use(client.token); // tes runs here
    // TEARDOWN , runs after a test even if failed
    await ctx.dispose();
  }, { scope: 'worker' }],

  bookingClient: async ({ request, workerToken }, use) => {
    await use(new BookingClient(request, workerToken));
  },

  // Leave-no-trace test data: register created ids, teardown deletes them
  createdBookings: async ({ bookingClient }, use) => {
    const ids = [];
    await use(ids);
    for (const id of ids) {
      await bookingClient.deleteBooking(id).catch(() => {}); // tolerate 404s
    }
  },
});

export { expect };