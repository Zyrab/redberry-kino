import { useEffect, useState } from "react";
import { useParams } from "react-router";
import Button from "../../components/ui/button";
import useMovie from "../../hooks/use-movie";
import { useAuth } from "../../context/auth-context";

import { addRecentlyViewed } from "../../utils/recently-viewed";

import "../../styles/movies.css";
import MovieDetails from "./details";
import MoviesHero from "./hero";
import Sessions from "./sessions";

export default function Movies() {
  const { slug } = useParams();
  const { movie, loading, error } = useMovie(slug);
  const { requireAuth } = useAuth();
  const [bookingSession, setBookingSession] = useState(null);

  useEffect(() => {
    if (movie) addRecentlyViewed(movie);
  }, [movie]);

  if (loading) return <div className="movie-page-state text-body-l">Loading...</div>;

  if (error || !movie) {
    return (
      <div className="movie-page-state">
        <p className="text-body-l">{error?.status === 404 ? "Movie not found." : "Something went wrong while loading this movie."}</p>
        {error?.status !== 404 && <Button onClick={() => window.location.reload()}>Retry</Button>}
      </div>
    );
  }

  // guests get the login modal first, then the same action continues automatically
  const handleSelect = (session) => requireAuth(() => setBookingSession(session));

  return (
    <div className="movie-page">
      <MoviesHero movie={movie} />
      <div className="movie-body">
        <Sessions movie={movie} onSelect={handleSelect} />
        <MovieDetails movie={movie} />
      </div>
      {/* TODO: {bookingSession && <BookingModal session={bookingSession} onClose={() => setBookingSession(null)} />} */}
    </div>
  );
}
