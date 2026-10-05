import { useState } from "react";
import "../../styles/home.css";
import Button from "../../components/ui/button";
import MovieCard from "../../components/ui/movie-card";
import useHomeMovies from "../../hooks/use-home-moves";

import { getRecentlyViewed } from "../../utils/recently-viewed";
import { api } from "../../utils/api";

import Slider from "./slider";
import SectionHeader from "./section-header";
import { useAuth } from "../../context/auth-context";

function Home() {
  const { nowPlaying, featured, comingSoon, loading, error } = useHomeMovies();
  const [recent] = useState(getRecentlyViewed);
  const [notified, setNotified] = useState({});

  const { openAuthModal } = useAuth();

  const isNotified = (movie) => notified[movie.slug] ?? movie.isNotified;

  function handleBuy(movie) {
    navigate(`/movies/${movie.slug}`);
  }

  async function handleNotify(movie) {
    if (isNotified(movie)) return;
    setNotified((prev) => ({ ...prev, [movie.slug]: true }));
    try {
      await api(`/movies/${movie.slug}/notify`, { method: "POST" });
    } catch (err) {
      setNotified((prev) => ({ ...prev, [movie.slug]: false }));
      if (err.status === 401) openAuthModal("login", () => handleNotify(movie));
    }
  }

  if (error) {
    return (
      <section className="home-section home-state">
        <p className="text-body-l">Something went wrong while loading movies.</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </section>
    );
  }

  return (
    <>
      <Slider featured={featured} loading={loading} />
      {!loading && (
        <>
          {recent.length > 0 && (
            <>
              <section className="home-section">
                <SectionHeader title="Recently Viewed" />
                <div className="movie-row">
                  {recent.map((movie) => (
                    <Link key={movie.id} to={`/movies/${movie.id}`} className="home-recent-link">
                      <MovieCard variant="small" data={movie} />
                    </Link>
                  ))}
                </div>
              </section>
              <hr className="home-divider" />
            </>
          )}
          <section className="home-section">
            <SectionHeader title="NOW PLAYING" to="/sessions" />
            <div className="movie-row">
              {nowPlaying.map((movie) => (
                <MovieCard
                  key={movie.id}
                  variant="big"
                  data={movie}
                  actions={
                    <>
                      <span className="text-button">From ₾{movie.fromPrice}</span>
                      <Button onClick={() => handleBuy(movie)}>Buy Ticket</Button>
                    </>
                  }
                />
              ))}
            </div>
          </section>
          <hr className="home-divider" />
          <section className="home-section">
            <SectionHeader title="COMING SOON..." to="/sessions" />
            <div className="movie-row">
              {comingSoon.map((movie) => (
                <MovieCard
                  key={movie.id}
                  data={movie}
                  actions={
                    <>
                      <Button variant="outline" size="sm" leftIcon={isNotified(movie) ? "check" : "bell"} onClick={() => handleNotify(movie)}>
                        {isNotified(movie) ? "Reminder set" : "Notify Me"}
                      </Button>
                    </>
                  }
                />
              ))}
            </div>
          </section>
        </>
      )}
    </>
  );
}

export default Home;
