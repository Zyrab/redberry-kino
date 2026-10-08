import { useNavigate } from "react-router";
import Pagination from "../../components/ui/pagination";
import { useAuth } from "../../context/auth-context";
import useSessions from "../../hooks/use-sessions";
import SessionGroup from "./session-group";

export default function SessionsList({ options, filters }) {
  const { sorts = [] } = options;
  const { apiQuery, sort, setSort, page, setPage } = filters;
  const navigate = useNavigate();
  const { requireAuth } = useAuth();
  const { groups, meta, loading, error } = useSessions(apiQuery);

  const openSession = (s) => requireAuth(() => navigate(`/movies/${s.movie.slug}?date=${s.date}&session=${s.id}`));

  function changePage(p) {
    setPage(p);
    window.scrollTo({ top: 0 });
  }

  return (
    <div className="sessions-list">
      <header className="list-header">
        <p className="text-label-m">{meta && (meta.totalSessions > 0 ? `Showing ${meta.totalSessions} sessions` : "No sessions found")}</p>
        <label className="text-body-m">
          Sort:{" "}
          <select value={sort || "time_asc"} onChange={(e) => setSort(e.target.value)}>
            {sorts.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      </header>

      {error && <p className="text-body-m list-state">Couldn't load sessions. Please try again.</p>}

      <div className={`list-groups ${loading ? "is-loading" : ""}`}>
        {groups.map(({ movie, sessions }) => (
          <SessionGroup key={movie.id} movie={movie} sessions={sessions} onSelect={openSession} />
        ))}
      </div>

      {meta && <Pagination page={meta.currentPage} lastPage={meta.lastPage} onChange={changePage} />}
    </div>
  );
}
