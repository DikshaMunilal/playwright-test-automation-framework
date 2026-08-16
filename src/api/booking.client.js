export class BookingClient {
  constructor(request, token = null) {
    this.request = request;
    this.token = token;
  }

  // Restful-Booker requires the token as a Cookie header on write operations
  #authHeaders() {
    return this.token ? { Cookie: `token=${this.token}` } : {};
  }

  async auth(username, password) {
    const res = await this.request.post('/auth', { data: { username, password } });
    const body = await res.json();
    this.token = body.token ?? null;
    return res;
  }

  createBooking(booking) {
    return this.request.post('/booking', { data: booking });
  }

  getBooking(id) {
    return this.request.get(`/booking/${id}`);
  }

  updateBooking(id, booking) {
    return this.request.put(`/booking/${id}`, { data: booking, headers: this.#authHeaders() });
  }

  partialUpdate(id, patch) {
    return this.request.patch(`/booking/${id}`, { data: patch, headers: this.#authHeaders() });
  }

  deleteBooking(id) {
    return this.request.delete(`/booking/${id}`, { headers: this.#authHeaders() });
  }
}