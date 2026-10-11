import { api } from "./api";

export const holdSeats = (sessionId, lines) =>
  api(`/sessions/${sessionId}/holds`, {
    method: "POST",
    body: { seats: lines.map((l) => ({ seatId: l.seat.id, ticketType: l.type.slug })) },
  }).then((res) => res.data);

export const releaseHold = (holdId) => api(`/holds/${holdId}`, { method: "DELETE" });

export const submitOrder = (holdId, buyer) => api("/orders", { method: "POST", body: { holdId, ...buyer } }).then((res) => res.data);
