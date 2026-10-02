import { useEffect, useState } from "react";
import { api } from "../utils/api";

export default function useHomeMovies() {
  const [data, setData] = useState({ nowPlaying: [], comingSoon: [], featured: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const [nowPlaying, comingSoon, featured] = await Promise.all([
          api("/movies/now-playing"),
          api("/movies/coming-soon"),
          api("/movies/featured"),
        ]);

        const featuredDetails = await Promise.all(featured.data.map((m) => api(`/movies/${m.slug}`)));

        setData({
          nowPlaying: nowPlaying.data,
          comingSoon: comingSoon.data,
          featured: featuredDetails.map((res) => res.data),
        });
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return { ...data, loading, error };
}
