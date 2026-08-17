import { test, expect } from '../../src/fixtures/api.fixtures.js';
import { makeBooking } from '../../src/data/booking.factory.js';
import { validateBooking, validateCreateResponse } from '../../src/schemas/booking.schema.js';

async function createAndRegister(client, registry, booking) {
  const res = await client.createBooking(booking);
  expect(res.status()).toBe(200);
  const body = await res.json();
  registry.push(body.bookingid);
  return body;
}

test.describe('booking CRUD', () => {
  test('creates a booking matching the payload and contract', async ({ bookingClient, createdBookings }) => {
    const booking = makeBooking();
    const body = await createAndRegister(bookingClient, createdBookings, booking);
    expect(validateCreateResponse(body), JSON.stringify(validateCreateResponse.errors)).toBe(true);
    expect(body.booking).toEqual(booking);
  });

  test('reads a booking back by id', async ({ bookingClient, createdBookings }) => {
    const booking = makeBooking();
    const { bookingid } = await createAndRegister(bookingClient, createdBookings, booking);

    const res = await bookingClient.getBooking(bookingid);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(validateBooking(body), JSON.stringify(validateBooking.errors)).toBe(true);
    expect(body).toEqual(booking);
  });

  test('fully updates a booking via PUT', async ({ bookingClient, createdBookings }) => {
    const { bookingid } = await createAndRegister(bookingClient, createdBookings, makeBooking());
    const updated = makeBooking({ totalprice: 999 });

    await test.step('update with a fresh payload', async () => {
      const res = await bookingClient.updateBooking(bookingid, updated);
      expect(res.status()).toBe(200);
    });

    await test.step('read-back confirms the new values', async () => {
      const body = await (await bookingClient.getBooking(bookingid)).json();
      expect(body).toEqual(updated);
    });
  });

  test('partially updates a booking via PATCH preserving other fields', async ({ bookingClient, createdBookings }) => {
    const original = makeBooking();
    const { bookingid } = await createAndRegister(bookingClient, createdBookings, original);
    const patch = { firstname: 'Patched', lastname: 'Name' };

    const res = await bookingClient.partialUpdate(bookingid, patch);
    expect(res.status()).toBe(200);

    const body = await (await bookingClient.getBooking(bookingid)).json();
    expect(body).toEqual({ ...original, ...patch }); // patched fields changed, rest preserved
  });

  test('deletes a booking and proves it is gone', async ({ bookingClient, createdBookings }) => {
    const { bookingid } = await createAndRegister(bookingClient, createdBookings, makeBooking());

    await test.step('delete the booking', async () => {
      const res = await bookingClient.deleteBooking(bookingid);
      expect(res.status()).toBe(201); // API quirk: 201 on successful delete
    });

    await test.step('read-back returns 404 — deletion is real, not just a status code', async () => {
      const res = await bookingClient.getBooking(bookingid);
      expect(res.status()).toBe(404);
    });
  });

  test('returns 404 for a nonexistent booking', async ({ bookingClient }) => {
    const res = await bookingClient.getBooking(999999999);
    expect(res.status()).toBe(404);
  });

  test('rejects delete without a token', async ({ request, bookingClient, createdBookings }) => {
    const { bookingid } = await createAndRegister(bookingClient, createdBookings, makeBooking());
    const res = await request.delete(`/booking/${bookingid}`); // no auth cookie
    expect(res.status()).toBe(403);
  });

  test('rejects a booking missing required fields', async ({ bookingClient }) => {
    const invalid = makeBooking();
    delete invalid.firstname;
    
    const res = await bookingClient.createBooking(invalid);
    expect(res.status()).toBe(500);
  })
});