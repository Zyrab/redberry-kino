import { useEffect, useState } from "react";
import { api } from "../utils/api";

const DEBOUNCE_MS = 300;

export default function useSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | loading | done | error

  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setResults([]);
      setStatus("idle");
      return;
    }

    setStatus("loading");
    let ignore = false; // set when the query changes, so late responses are dropped

    const timer = setTimeout(async () => {
      try {
        const res = await api(`/search?q=${encodeURIComponent(q)}`);
        if (ignore) return;
        setResults(res.data);
        setStatus("done");
      } catch {
        if (ignore) return;
        setResults([]);
        setStatus("error");
      }
    }, DEBOUNCE_MS);

    return () => {
      ignore = true;
      clearTimeout(timer);
    };
  }, [query]);

  const onSearch = (e) => setQuery(e.target.value);
  const onClear = () => setQuery("");

  return { query, results, status, onSearch, onClear };
}
