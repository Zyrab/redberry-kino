import { useState } from "react";

import Button from "../../components/ui/button";
import Badge from "../../components/ui/badge";

import { useAuth } from "../../context/auth-context";

import { api } from "../../utils/api";
import { formatRefundDeadline } from "../../utils/format-refund-deadline";

const REFUND_CLOSED = "Refunds close 2 hours before the session starts.";

export default function TicketCard({ order, onUpdate }) {
  const { openAuthModal } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { session, tickets } = order;
  const { movie, venue, hall, format, language } = session;

  const refund = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await api(`/orders/${order.reference}/refund`, { method: "POST" });
      onUpdate(res.data);
    } catch (err) {
      if (err.status === 401) {
        openAuthModal("login", refund);
        return;
      }
      setError(err.message || "Failed to process refund.");
    } finally {
      setLoading(false);
    }
  };

  const handleRefund = () => {
    if (!order.isRefundable) return;
    if (!window.confirm("Are you sure you want to refund this order? This action cannot be undone.")) return;
    refund();
  };

  const details = [
    { label: "DATE", value: `${session.date} • ${session.time}` },
    { label: "VENUE", value: `${venue.name} • Hall ${hall.name}` },
    { label: "FORMAT", value: `${format.name} • ${language.name}` },
  ];
  return (
    <article className="ticket-card">
      <img className="ticket-card-poster" src={movie.posterUrl} alt={movie.title} />

      <div className="ticket-card-info">
        <div className="ticket-card-header">
          <h3 className="text-h2">{movie.title}</h3>
          <Badge variant="red" label={movie.ageRating.code} />
          <span className="text-body-m">{movie.runtimeMinutes} min</span>
        </div>

        <div className="ticket-card-details">
          {details.map(({ label, value }) => (
            <div key={label}>
              <h5 className="text-overline">{label}</h5>
              <p className="text-label-m">{value}</p>
            </div>
          ))}
        </div>

        <div className="ticket-card-seats">
          <h5 className="text-overline">Seats</h5>
          {tickets.map((ticket) => (
            <span key={ticket.id} className="text-label-s">
              {ticket.seatCode} - {ticket.ticketType.name}
            </span>
          ))}
        </div>
      </div>

      <div className="ticket-card-actions">
        <div>
          <h5 className="text-overline">Order</h5>
          <p className="text-label-m">#{order.reference}</p>
        </div>

        <div className="ticket-card-total">
          <h4 className="text-label-m">Total paid</h4>
          <p className="text-h1">₾{order.totalPrice}</p>
        </div>

        {order.isUpcoming && (
          <div className="ticket-card-refund" title={order.isRefundable ? undefined : REFUND_CLOSED}>
            <Button variant="transparent" onClick={handleRefund} disabled={!order.isRefundable || loading}>
              {loading ? "Refunding..." : "Refund"}
            </Button>
            <p className="text-body-s ticket-card-note">
              {order.isRefundable ? `Refundable until ${formatRefundDeadline(session.startsAt)}` : REFUND_CLOSED}
            </p>{" "}
            {error && (
              <p className="text-body-s ticket-card-error" role="alert">
                {error}
              </p>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
