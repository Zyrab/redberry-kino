import { useEffect, useState } from "react";
import { api } from "../utils/api";

export default function useHomeMovies() {
  const [data, setData] = useState({ nowPlaying: [], comingSoon: [], featured: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([api("/movies/now-playing"), api("/movies/coming-soon"), api("/movies/featured")])
      .then(([nowPlaying, comingSoon, featured]) => {
        setData({ nowPlaying: nowPlaying.data, comingSoon: comingSoon.data, featured: featured.data });
      })
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { ...data, loading, error };
}
