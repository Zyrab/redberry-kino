import { sessionShort, summarizeTickets, formatPrice } from "../../utils/booking";

export default function OrderSummary({ session, lines, total, children }) {
  const { movie } = session;
  return (
    <aside className="booking-aside">
      <div className="booking-order">
        <h3 className="text-label-m">{movie.title}</h3>
        <p className="text-body-s booking-muted">{sessionShort(session)}</p>
        <dl className="booking-order-rows text-body-s">
          <div>
            <dt className="booking-muted">Seats</dt>
            <dd className="text-label-s">{lines.map((l) => l.seat.code).join(", ")}</dd>
          </div>
          <div>
            <dt className="booking-muted">Tickets</dt>
            <dd className="text-label-s">{summarizeTickets(lines)}</dd>
          </div>
        </dl>
      </div>

      <footer className="booking-footer">
        <div className="booking-subtotal">
          <span className="text-overline">Subtotal</span>
          <span className="text-h2">{formatPrice(total)}</span>
        </div>
        {children}
      </footer>
    </aside>
  );
}
