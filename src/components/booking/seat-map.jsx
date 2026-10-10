import { Fragment } from "react";
import Seat from "../ui/seat";

const LEGEND = [
  { status: "available", label: "Available" },
  { status: "selected", label: "Selected" },
  { status: "sold", label: "Sold" },
  { status: "held", label: "Held by another user" },
];

export default function SeatMap({ sections = [], selectedIds, onToggle }) {
  return (
    <div className="seat-map">
      <div className="seat-screen text-label-s">Screen</div>

      <div className="seat-sections">
        {sections.map((section) => {
          const { rows } = section;
          return (
            <section key={section.name} className="seat-section">
              <h3 className="text-label-s seat-section-title">
                {section.name}
                {rows.length > 0 && ` · Rows ${rows[0].label}-${rows[rows.length - 1].label}`}
              </h3>

              {rows.map((row) => (
                <div key={row.label} className="seat-row">
                  <span className="text-label-s">{row.label}</span>
                  <div className="seat-row-seats">
                    {row.seats.map((seat) => (
                      <Fragment key={seat.id}>
                        <Seat seat={seat} selected={selectedIds.has(seat.id)} onToggle={onToggle} />
                        {seat.aisleAfter && <span className="seat-aisle" />}
                      </Fragment>
                    ))}
                  </div>
                </div>
              ))}
            </section>
          );
        })}
      </div>

      <ul className="seat-legend text-body-s">
        {LEGEND.map((l) => (
          <li key={l.status}>
            <span className={`seat-swatch seat-${l.status}`} /> {l.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
