import "../../styles/session-ticket.css";
import Icon from "./icon";

export default function SessionTicket({ session, disabled, title, onClick }) {
  const { time, language, format, price, isSoldOut, seatsLeft } = session;
  return (
    <button type="button" className="session" disabled={disabled} title={title} onClick={onClick}>
      <div className="session-main">
        <span className="text-h2">{time}</span>
        <div className="session-tags text-body-s">
          <span>{language.code}</span>
          <span className="session-format">{format.name}</span>
        </div>
      </div>

      <div className="session-divider" />

      <div className="session-side">
        <span className="session-price text-h3">₾{price}</span>
        <span className="session-seats text-body-s">
          <Icon name="ticket" />
          {isSoldOut ? "Sold out" : `${seatsLeft} left`}
        </span>
      </div>
    </button>
  );
}
