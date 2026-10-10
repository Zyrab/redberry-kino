import Button from "../ui/button";
import Icon from "../ui/icon";
import { formatPrice, ratioLabel, sessionShort, summarizeTickets } from "../../utils/booking";
import SeatMap from "./seat-map";
import StepTabs from "./step-tabs";

export default function SeatStep({ booking }) {
  const { seats, ticketTypes, maxSeats, selection, message, blocker, canNext, holding, user, actions } = booking;

  const { lines, total, notice, toggle, remove, setType } = selection;
  const selectedIds = new Set(lines.map((l) => l.seat.id));
  const info = notice || message;

  return (
    <>
      <div className="booking-left">
        <StepTabs step="seats" />
        <SeatMap sections={seats?.sections} selectedIds={selectedIds} onToggle={toggle} />
      </div>

      <aside className="booking-aside">
        <h3 className="text-button">Your seats · Max {maxSeats}</h3>
        {lines.length === 0 && (
          <p className="text-body-s booking-muted">Pick up to {maxSeats} seats from the map. Each seat can carry its own ticket type.</p>
        )}

        <div className="booking-lines">
          {lines.map((l) => (
            <div key={l.seat.id} className={`booking-line ${l.violation ? "has-error" : ""}`}>
              <div className="booking-line-top">
                <span className="text-body-s booking-muted">Seat</span>
                <span className="text-label-s">{l.seat.code}</span>
                <span className="text-label-s booking-line-price">{formatPrice(l.price)}</span>
                <button type="button" className="booking-line-remove" aria-label={`Remove ${l.seat.code}`} onClick={() => remove(l.seat.id)}>
                  <Icon name="close" />
                </button>
              </div>

              <div className="booking-chips">
                {[...ticketTypes]
                  .sort((a, b) => a.priceRatio - b.priceRatio)
                  .map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      className={`booking-chip text-body-s ${t.id === l.type.id ? "is-active" : ""}`}
                      onClick={() => setType(l.seat.id, t.id)}
                    >
                      {ratioLabel(t)}
                    </button>
                  ))}
              </div>

              {l.violation && (
                <p className="text-body-s booking-error">
                  {l.seat.code}: {l.violation}
                </p>
              )}
            </div>
          ))}
        </div>

        <footer className="booking-footer">
          {info && (
            <p className="text-body-s booking-error" role="alert">
              {info}
            </p>
          )}
          {blocker && <p className="text-body-s booking-error">{blocker}</p>}
          {blocker && !user.profileComplete && (
            <Button variant="outline" size="sm" onClick={actions.toProfile}>
              Complete profile
            </Button>
          )}
          <div className="booking-subtotal">
            <span className="text-label-s">SUBTOTAL</span>
            <span className="text-h1">{formatPrice(total)}</span>
          </div>
          <Button onClick={actions.next} disabled={!canNext}>
            {holding ? "Holding seats..." : "Next: Checkout"}
          </Button>
        </footer>
      </aside>
    </>
  );
}
