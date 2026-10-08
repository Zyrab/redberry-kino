import "../../styles/day-picker.css";

export default function DayPicker({ days, variant = "big", value, onChange, isDisabled = () => false }) {
  return (
    <div className="day-picker" role="group" aria-label="Choose a date">
      {days.map((d) => {
        const active = d.iso === value;
        return (
          <button
            key={d.iso}
            type="button"
            className={`day-picker-item day-picker-item-${variant} ${active ? "is-active" : ""}`}
            disabled={isDisabled(d)}
            aria-pressed={active}
            onClick={() => onChange(d.iso)}
          >
            <span className="text-label-s">{d.weekday}</span>
            <span className={variant === "big" ? "text-h3" : "text-label-s"}>{d.day}</span>
          </button>
        );
      })}
    </div>
  );
}
