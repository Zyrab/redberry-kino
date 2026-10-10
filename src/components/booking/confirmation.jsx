import Button from "../ui/button";
import Icon from "../ui/icon";
import { formatPrice, sessionShort, summarizeTickets } from "../../utils/booking";

export default function Confirmation({ order, onTickets, onHome }) {
  const { reference, totalPrice, session, tickets } = order;
  const { movie, venue } = session;
  const seatCodes = tickets.map((t) => t.seatCode).join(", ");
  const ticketSummary = summarizeTickets(tickets.map((t) => ({ type: t.ticketType })));
  return (
    <div className="booking-done">
      <span className="booking-done-icon">
        <Icon name="check" />
      </span>
      <h2 className="text-h1">Booking confirmed!</h2>
      <p className="text-body-m booking-muted">Your tickets are ready. We've sent the confirmation to your email.</p>
      <span className="booking-ref text-label-s">ORDER #{reference}</span>

      <div className="booking-receipt">
        <div className="booking-receipt-head">
          <img src={movie.posterUrl} alt="" />
          <div>
            <h3 className="text-button">{movie.title}</h3>
            <p className="text-body-s booking-muted">
              {venue.name} · {sessionShort(session)}
            </p>
          </div>
        </div>
        <dl className="booking-order-rows text-body-s">
          <div>
            <dt className="booking-muted">Seats</dt>
            <dd className="text-label-s">{seatCodes}</dd>
          </div>
          <div>
            <dt className="booking-muted">Tickets</dt>
            <dd className="text-label-s">{ticketSummary}</dd>
          </div>
        </dl>
        <div className="booking-receipt-total">
          <span className="text-body-s booking-muted">TOTAL PAID</span>
          <span className="text-h3">{formatPrice(totalPrice)}</span>
        </div>
      </div>

      <div className="booking-done-actions">
        <Button onClick={onTickets}>View my tickets</Button>
        <Button variant="transparent" onClick={onHome}>
          Back to home
        </Button>
      </div>
    </div>
  );
}
