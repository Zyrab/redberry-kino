import Filters from "./filters";
import SessionsList from "./sessions-list";
import { useFilterOptions } from "../../context/filter-options-context";
import useSessionFilters from "../../hooks/use-session-filters";
import "../../styles/sessions.css";

export default function Sessions() {
  const options = useFilterOptions();
  const filters = useSessionFilters(options);

  return (
    <div className="sessions">
      <header className="sessions-header">
        <h1 className="text-h1">Sessions</h1>
        <p className="text-body-m">Browse showtimes across all venues</p>
      </header>
      <div className="sessions-body">
        <Filters options={options} filters={filters} />
        <SessionsList options={options} filters={filters} />
      </div>
    </div>
  );
}
