import { useEffect, useState } from "react";
import { api } from "../utils/api";

export default function useMovieSessions(slug, date, enabled = true) {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!enabled || !date) {
      setVenues([]);
      return;
    }
    let ignore = false;
    setLoading(true);
    setError(null);
    api(`/movies/${slug}/sessions?date=${date}`)
      .then((res) => !ignore && setVenues(res.data))
      .catch((err) => {
        if (ignore) return;
        setVenues([]);
        setError(err);
      })
      .finally(() => !ignore && setLoading(false));
    return () => {
      ignore = true;
    };
  }, [slug, date, enabled]);

  return { venues, loading, error };
}
