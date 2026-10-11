import { useEffect, useState } from "react";
import { api } from "../utils/api";

export default function useSessions(query) {
  const [state, setState] = useState({ groups: [], meta: null, loading: true, error: null });

  useEffect(() => {
    let ignore = false;
    setState((s) => ({ ...s, loading: true, error: null }));
    api(`/sessions?${query}`)
      .then((res) => !ignore && setState({ groups: res.data, meta: res.meta, loading: false, error: null }))
      .catch((error) => !ignore && setState((s) => ({ ...s, loading: false, error })));
    return () => {
      ignore = true;
    };
  }, [query]);
  return state;
}
