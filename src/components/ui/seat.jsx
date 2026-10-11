import "../../styles/seat.css";

export default function Seat({ seat, selected, onToggle }) {
  const { label, code, state, isMine } = seat;
  if (state === "unavailable") return null;

  const mine = state === "held" && isMine;
  const selectable = state === "available" || mine;
  const status = selected ? "selected" : mine ? "available" : state;

  return (
    <button
      type="button"
      className={`seat seat-${status} text-label-m`}
      disabled={!selectable}
      aria-pressed={selected}
      aria-label={`Seat ${code}, ${status}`}
      onClick={() => onToggle(seat)}
    >
      {label}
    </button>
  );
}
