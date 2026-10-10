import useBooking from "../../hooks/use-booking";
import { sessionSubtitle } from "../../utils/booking";
import Button from "../ui/button";
import Modal from "../ui/modal";
import CheckoutStep from "./checkout-step";
import Confirmation from "./confirmation";
import HoldTimer from "./hold-timer";
import SeatStep from "./seat-step";
import "../../styles/booking.css";

function LoadState({ error, onClose }) {
  return (
    <div className="booking-state">
      <p className="text-body-l">{error ? "Couldn't load this session." : "Loading..."}</p>
      {error && <Button onClick={onClose}>Close</Button>}
    </div>
  );
}

function BookingHeader({ session, hold, onExpire }) {
  return (
    <header className="booking-header">
      <div>
        <h2 className="text-h2">{session.movie.title}</h2>
        <p className="text-body-s booking-muted">{sessionSubtitle(session)}</p>
      </div>
      {hold && (
        <div className="booking-timer">
          <span className="text-overline">Seats held</span>
          <HoldTimer expiresAt={hold.expiresAt} onExpire={onExpire} />
        </div>
      )}
    </header>
  );
}

function Content({ booking }) {
  const { loading, error, session, step, hold, order, actions } = booking;

  if (loading || error || !session) return <LoadState error={error} onClose={actions.close} />;
  if (step === "confirmed") return <Confirmation order={order} onTickets={actions.toTickets} onHome={actions.toHome} />;

  return (
    <>
      <BookingHeader session={session} hold={hold} onExpire={actions.expire} />
      <div className="booking-main">{step === "seats" ? <SeatStep booking={booking} /> : <CheckoutStep booking={booking} />}</div>
    </>
  );
}

export default function BookingModal({ sessionId, onClose }) {
  const booking = useBooking({ sessionId, onClose });
  return (
    <Modal onClose={booking.actions.close} className="booking-modal" showClose={false}>
      <Content booking={booking} />
    </Modal>
  );
}
