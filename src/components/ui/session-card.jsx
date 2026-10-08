import "../../styles/session-card.css";
import Icon from "./icon";

export default function SessionCard({ session, onClick }) {
  const { time, format, language, venue, hall, price, seatsLeft, isSoldOut } = session;
  const few = seatsLeft < 10;
  return (
    <button type="button" className="session-card" disabled={isSoldOut} onClick={onClick}>
      <div className="group">
        <span className="text-h3">{time}</span>
        <span className="format text-label-s">{format.name}</span>
      </div>
      <div className="group">
        <span className="language text-body-s">{language.name}</span>
        <span className={`seats ${few && "few-left"} text-body-s`}>
          {isSoldOut ? (
            "Sold out"
          ) : (
            <>
              <Icon name="ticket" /> {seatsLeft} left
            </>
          )}
        </span>
      </div>
      <div className="group">
        <span className="text-label-s">
          {venue.name} · Hall {hall.name}
        </span>
        <span className="price text-button">₾{price}</span>
      </div>
    </button>
  );
}
