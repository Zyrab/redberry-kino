import { Link } from "react-router";
import Badge from "../../components/ui/badge";
import SessionCard from "../../components/ui/session-card";

export default function SessionGroup({ movie, sessions, onSelect }) {
  const { slug, title, posterUrl, ageRating, runtimeMinutes } = movie;
  return (
    <article className="session-group">
      <div className="session-group-content">
        <img className="session-group-poster" src={posterUrl} alt={`${title} poster`} />
        <header className="session-group-header">
          <div className="session-group-title">
            <Link to={`/movies/${slug}`} className="text-h3">
              {title}
            </Link>
            {ageRating && <Badge variant="red" label={ageRating.code} />}
          </div>
          <span className="text-body-m session-group-duration">{runtimeMinutes} min</span>
        </header>
      </div>
      <div className="session-group-times">
        {sessions.map((s) => (
          <SessionCard key={s.id} session={s} onClick={() => onSelect(s)} />
        ))}
      </div>
    </article>
  );
}
