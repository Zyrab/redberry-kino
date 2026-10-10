import { useCallback, useEffect, useState } from "react";
import { api } from "../utils/api";

export default function useBookTickets(id) {
  const [session, setSession] = useState(null);
  const [seats, setSeats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError(null);
    Promise.all([api(`/sessions/${id}`), api(`/sessions/${id}/seats`)])
      .then(([s, m]) => {
        if (ignore) return;
        setSession(s.data);
        setSeats(m.data);
      })
      .catch((err) => !ignore && setError(err))
      .finally(() => !ignore && setLoading(false));
    return () => {
      ignore = true;
    };
  }, [id]);

  const refetchSeats = useCallback(() => api(`/sessions/${id}/seats`).then((res) => setSeats(res.data)), [id]);

  return { session, seats, loading, error, refetchSeats };
}
