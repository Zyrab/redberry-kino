import "../../styles/movie-card.css";
import { getReleaseEyebrow } from "../../utils/format-release";
import Badge from "./badge";

const textStyles = {
  small: { title: "text-button", meta: "text-body-s" },
  medium: { title: "text-h3", meta: "text-body-m" },
  big: { title: "text-h2", meta: "text-body-m" },
};

export default function MovieCard({ variant = "medium", data, actions, className = "" }) {
  const { title, posterUrl, runtimeMinutes, ageRating, genres, releaseDate } = data;
  const { title: titleClass, meta: metaClass } = textStyles[variant];

  return (
    <article className={`movie-card movie-card-${variant} ${className}`}>
      <img className="movie-card-image" src={posterUrl} alt={title} />
      <div className="movie-card-body">
        {variant === "medium" && <p className="movie-card-eyebrow text-overline">{getReleaseEyebrow(releaseDate)}</p>}
        <h3 className={titleClass}>{title}</h3>
        <p className={`movie-card-meta ${metaClass}`}>
          {genres[1]?.name} · {runtimeMinutes} min
        </p>
        {ageRating && <Badge variant="red" label={ageRating.code} />}
        {variant === "big" && ageRating.description && <p className="movie-card-description text-body-s">{ageRating.description}</p>}
        {actions && <div className="movie-card-actions">{actions}</div>}
      </div>
    </article>
  );
}
