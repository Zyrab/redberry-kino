import Badge from "../../components/ui/badge";

export default function MoviesHero({ movie }) {
  const { backdropUrl, posterUrl, title, isComingSoon, synopsis, ageRating, runtimeMinutes, formats } = movie;
  return (
    <section className="movie-hero" style={{ backgroundImage: `url(${backdropUrl})` }}>
      <div className="movie-hero-overlay" />
      <div className="movie-hero-content">
        <img className="movie-hero-poster" src={posterUrl} alt={`${title} poster`} />
        <div className="movie-hero-info">
          <Badge variant="red" label={isComingSoon ? "Coming soon" : "Now playing"} />
          <h1 className="text-display">{title}</h1>
          <p className="text-body-m">{synopsis}</p>
          <div className="movie-hero-meta">
            {ageRating && <Badge variant="red" label={ageRating.code} />}
            <Badge label={`${runtimeMinutes} Min`} />
            {formats.map((f) => (
              <Badge key={f.id} label={f.name} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
