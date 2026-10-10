import { useState } from "react";
import { getViolation, seatPrice, sumPrices } from "../utils/booking";
import { BOOKING_MSG } from "../utils/booking";

export default function useSeatSelection({ session, ticketTypes, maxSeats }) {
  const defaultType = ticketTypes.find((t) => t.priceRatio === 1) ?? ticketTypes[0]; // full price = Adult
  const [selected, setSelected] = useState([]); // [{ seat: { id, code }, typeId }]
  const [notice, setNotice] = useState(null);

  function toggle(seat) {
    setNotice(null);
    if (selected.some((s) => s.seat.id === seat.id)) {
      setSelected(selected.filter((s) => s.seat.id !== seat.id));
    } else if (selected.length >= maxSeats) {
      setNotice(BOOKING_MSG.seatLimit(maxSeats));
    } else {
      setSelected([...selected, { seat: { id: seat.id, code: seat.code }, typeId: defaultType.id }]);
    }
  }

  const remove = (seatId) => setSelected((list) => list.filter((s) => s.seat.id !== seatId));
  const setType = (seatId, typeId) => setSelected((list) => list.map((s) => (s.seat.id === seatId ? { ...s, typeId } : s)));
  const clear = () => setSelected([]);
  const dropByCodes = (codes) => setSelected((list) => list.filter((s) => !codes.includes(s.seat.code)));

  // selected entries + resolved type, price and rule violation
  const lines = selected.map((s) => {
    const type = ticketTypes.find((t) => t.id === s.typeId);
    return {
      ...s,
      type,
      price: seatPrice(session.price, type),
      violation: getViolation(type, session.movie.ageRating),
    };
  });

  return { lines, total: sumPrices(lines), notice, setNotice, toggle, remove, setType, clear, dropByCodes };
}
