import { useCallback, useEffect, useMemo, useState } from "react";

import { api } from "../utils/api";

export default function useTickets({ enabled = true } = {}) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!enabled) return;

    let active = true;
    setLoading(true);
    setError(null);

    api("/tickets")
      .then((res) => {
        if (active) setOrders(res.data ?? []);
      })
      .catch((err) => {
        if (active) setError(err.message || "Failed to load tickets.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [enabled]);

  const updateOrder = useCallback((updated) => {
    setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
  }, []);

  const { upcoming, past } = useMemo(
    () => ({
      upcoming: orders.filter((o) => o.isUpcoming),
      past: orders.filter((o) => !o.isUpcoming),
    }),
    [orders],
  );

  return { upcoming, past, loading, error, updateOrder };
}
