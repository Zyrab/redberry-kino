import { Link } from "react-router";

const capitalize = (s = "") => s.charAt(0).toUpperCase() + s.slice(1);
const metaLine = (m) => [capitalize(m.kind), m.ageRating?.code, m.runtimeMinutes && `${m.runtimeMinutes} min`].filter(Boolean).join(" · ");

export default function ResultList({ results, handleSelect }) {
  return (
    <>
      <header className="result-header text-overline">
        <span>Films &amp; Events</span>
        <span className="text-body-s">
          {results.length} {results.length === 1 ? "result" : "results"}
        </span>
      </header>
      <ul className="result-list">
        {results.map((m) => (
          <li key={m.id}>
            <Link to={`/movies/${m.slug}`} className="result-item" onClick={handleSelect}>
              {m.posterUrl ? <img className="result-poster" src={m.posterUrl} alt="" /> : <span className="result-poster" />}
              <span className="result-info">
                <span className="text-label-m">{m.title}</span>
                <span className="text-body-s result-meta">{metaLine(m)}</span>
              </span>
              {m.isComingSoon ? (
                <span className="text-label-m result-soon">Coming Soon</span>
              ) : (
                <span className="text-label-m">from ₾{m.fromPrice}</span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
