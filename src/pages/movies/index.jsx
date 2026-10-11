import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router";
import Button from "../../components/ui/button";
import useMovie from "../../hooks/use-movie";
import { useAuth } from "../../context/auth-context";

import { addRecentlyViewed } from "../../utils/recently-viewed";

import "../../styles/movies.css";
import MovieDetails from "./details";
import MoviesHero from "./hero";
import Sessions from "./sessions";
import BookingModal from "../../components/booking/booking-modal";

export default function Movies() {
  const { slug } = useParams();
  const { movie, loading, error } = useMovie(slug);
  const { requireAuth } = useAuth();
  const [bookingSessionId, setBookingSessionId] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const sessionId = searchParams.get("session");

  useEffect(() => {
    if (movie) addRecentlyViewed(movie);
  }, [movie]);

  useEffect(() => {
    if (sessionId) setBookingSessionId(sessionId);
  }, []);

  if (loading) return <div className="movie-page-state text-body-l">Loading...</div>;

  if (error || !movie) {
    return (
      <div className="movie-page-state">
        <p className="text-body-l">{error?.status === 404 ? "Movie not found." : "Something went wrong while loading this movie."}</p>
        {error?.status !== 404 && <Button onClick={() => window.location.reload()}>Retry</Button>}
      </div>
    );
  }

  function openBooking(sId) {
    requireAuth(() => {
      const next = new URLSearchParams(searchParams);
      next.set("session", sId);
      setSearchParams(next);
      setBookingSessionId(sId);
    });
  }

  const closeBooking = () => {
    const next = new URLSearchParams(searchParams);
    next.delete("session");
    setSearchParams(next, { replace: true });
    setBookingSessionId(null);
  };

  return (
    <div className="movie-page">
      <MoviesHero movie={movie} />
      <div className="movie-body">
        <Sessions movie={movie} onSelect={openBooking} />
        <MovieDetails movie={movie} />
      </div>
      {bookingSessionId && <BookingModal sessionId={bookingSessionId} onClose={closeBooking} />}
    </div>
  );
}
