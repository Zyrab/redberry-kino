import { formatDate } from "../../utils/dates";

export default function MovieDetails({ movie }) {
  const { director, cast, runtimeMinutes, releaseDate, formats, fromPrice, ageRating } = movie;

  const details = [
    { title: "Director", value: director },
    { title: "Main cast", value: Array.isArray(cast) ? cast.join(", ") : cast },
    { title: "Duration", value: `${runtimeMinutes} minutes` },
    { title: "Release date", value: formatDate(releaseDate) },
    { title: "Formats", value: formats.map((f) => f.name).join(", ") },
    { title: "From", value: fromPrice != null ? `₾${fromPrice}` : null },
  ].filter((d) => d.value); // skip fields the API didn't send

  return (
    <aside className="movie-details">
      <h2 className="text-h2">Details</h2>
      <dl className="movie-details-list">
        {details.map(({ title, value }) => (
          <div key={title} className="movie-details-item">
            <dt className="text-overline">{title}</dt>
            <dd className="text-label-m">{value}</dd>
          </div>
        ))}
      </dl>

      {ageRating && ageRating.minAge >= 16 && (
        <div className="rating-note">
          <p className="text-overline">Rating note</p>
          <p className="rating-note-text text-body-s">
            <span className="text-label-s">{ageRating.code}</span>
            <span className="text-body-s">{`Not recommended for under-${ageRating.minAge}s. Tickets require an account aged ${ageRating.minAge} or over.`}</span>
          </p>
        </div>
      )}
    </aside>
  );
}
