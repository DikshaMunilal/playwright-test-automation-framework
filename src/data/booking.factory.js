import { faker } from '@faker-js/faker';

export const makeBooking = (overrides = {}) => ({
  firstname: faker.person.firstName(),
  lastname: faker.person.lastName(),
  totalprice: faker.number.int({ min: 50, max: 500 }),
  depositpaid: true,
  bookingdates: { checkin: '2026-09-01', checkout: '2026-09-10' },
  additionalneeds: 'Breakfast',
  ...overrides,
});