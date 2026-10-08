import { useMemo } from "react";
import Button from "../../components/ui/button";
import DayPicker from "../../components/ui/day-picker";
import { buildDays } from "../../utils/dates";
import { buildGroups } from "../../utils/filter-group";

export default function Filters({ filters, options }) {
  const { getList, toggle, setDate, clearAll, activeCount, date } = filters;

  const days = useMemo(() => buildDays(7), []);
  const selectedDate = days.some((d) => d.iso === date) ? date : days[0].iso;

  if (options.error) return <aside className="filters text-body-m">Couldn't load filters.</aside>;
  if (options.loading) return <aside className="filters" />;

  const groups = buildGroups(options, getList("venue"));

  return (
    <aside className="filters">
      <h2 className="text-h2">Filters</h2>

      {groups.map((g) => (
        <div key={g.param} className="filters-block">
          <section className="filters-section">
            <h3 className="text-overline filters-title">{g.title}</h3>
            {g.options.map((o) => (
              <label key={o.value} className="filters-option">
                <input type="checkbox" checked={getList(g.param).includes(o.value)} onChange={() => toggle(g.param, o.value)} />
                <span className="text-label-m">{o.label}</span>
                {o.hint && <span className="text-body-s filters-hint">· {o.hint}</span>}
              </label>
            ))}
          </section>

          {g.param === "venue" && (
            <section className="filters-section">
              <h3 className="text-overline filters-title">Date</h3>
              <div className="filters-days">
                <DayPicker variant="small" days={days} value={selectedDate} onChange={setDate} />
              </div>
            </section>
          )}
        </div>
      ))}

      <footer className="filters-footer">
        <Button variant="outline" size="sm" onClick={clearAll} disabled={activeCount === 0}>
          Clear all filters
        </Button>
        <span className="text-body-s filters-count">
          {activeCount} {activeCount === 1 ? "filter" : "filters"} active
        </span>
      </footer>
    </aside>
  );
}
