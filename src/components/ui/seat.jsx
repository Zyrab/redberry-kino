import "../../styles/seat.css";

export default function Seat({ seat, selected, onToggle }) {
  const { label, code, state } = seat;
  if (state === "unavailable") return null;

  const status = selected ? "selected" : state;
  return (
    <button
      type="button"
      className={`seat seat-${status} text-h3`}
      disabled={state !== "available"}
      aria-pressed={selected}
      aria-label={`Seat ${code}, ${status}`}
      onClick={() => onToggle(seat)}
    >
      {label}
    </button>
  );
}
